using Microsoft.AspNetCore.Mvc;
using Biller.Api.Services;
using Biller.Api.Models;
using System.Collections.Concurrent;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace Biller.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(UserService userService, JwtService jwtService, IConfiguration config, RefreshTokenService refreshTokenService) : ControllerBase
    {
        private readonly UserService _userService = userService;
        private readonly JwtService _jwtService = jwtService;
        private readonly IConfiguration _config = config;
        private readonly RefreshTokenService _refService = refreshTokenService;

        // In-memory OTP store for now (replace later with DB or cache)
        private static readonly ConcurrentDictionary<string, (string Otp, DateTime Expiry)> _otpStore = new();

        // POST: api/auth/send-otp
        [HttpPost("send-otp")]
        public IActionResult SendOtp([FromBody] SendOtpRequest request)
        {

            if (string.IsNullOrWhiteSpace(request.PhoneNumber))
                return BadRequest("Phone number is required.");

            // Generate a random 6-digit OTP
            var otp = new Random().Next(100000, 999999).ToString();
            var expiry = DateTime.UtcNow.AddMinutes(2);

            _otpStore[request.PhoneNumber] = (otp, expiry);

            // For now, we’ll just return it in response (later we’ll send via SMS)
            Console.WriteLine($"OTP for {request.PhoneNumber}: {otp}");

            return Ok(new { message = "OTP sent successfully.", otp }); // otp is just for testing
        }

        // POST: api/auth/verify-otp
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {

            if (!_otpStore.TryGetValue(request.PhoneNumber, out var otpData))
                return BadRequest("No OTP found. Please request a new one.");

            if (DateTime.UtcNow > otpData.Expiry)
                return BadRequest("OTP has expired.");

            if (otpData.Otp != request.Otp)
                return Unauthorized("Invalid OTP.");

            // Success — clear OTP and issue token (later we’ll add JWT)
            _otpStore.TryRemove(request.PhoneNumber, out _);

            try
            {
                User? user = await _userService.GetUserByPhoneAsync(request.PhoneNumber);

                // Create first time user
                user ??= await _userService.CreateUserAsync(request.PhoneNumber);

                // generate and store a refresh token in cookies
                RefreshToken refreshToken = await _refService.CreateToken(user.Id, Request.Headers.UserAgent.ToString());
                Response.Cookies.Append("refresh-token", refreshToken.Token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false, // set false only in localhost for testing
                    SameSite = SameSiteMode.Unspecified,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                // generate JWT and store in cookies
                string token = _jwtService.GenerateToken(user.Id.ToString(), user.PhoneNumber);
                Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false, // set false only in localhost for testing
                    SameSite = SameSiteMode.Unspecified,
                    Expires = DateTime.UtcNow.AddMinutes(60)
                });

                return Ok(new { message = "Logged in", isNewUser = !user.IsOnboarded, user });
            }
            catch (Exception ex)
            {
                // Log the exception (optional: use ILogger)
                Console.WriteLine(ex.Message);

                return StatusCode(500, new { message = "An error occurred while logging in." });
            }
        }

        // GET: api/auth/me
        // [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            string refreshTokenString = Request.Cookies["refresh-token"]!;
            string token = Request.Cookies["jwt"]!;

            if (string.IsNullOrEmpty(refreshTokenString))
                return Unauthorized(new { message = "No token found, please login again" });

            bool isRefreshTokenValid = await _refService.CheckValidity(refreshTokenString);
            if (!isRefreshTokenValid) { return Unauthorized(new { message = "Token expired, please login again" }); }

            if (string.IsNullOrEmpty(token))
                return Unauthorized(new { message = "No token found" });

            try
            {
                var jwtSettings = _config.GetSection("Jwt");
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY")!));

                var tokenHandler = new JwtSecurityTokenHandler();
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = key
                }, out var validatedToken);

                // Extract phone number instead of ID
                var phone = principal.FindFirst("phone")?.Value;

                if (phone == null)
                    return Unauthorized(new { message = "Phone number not found in token" });

                // Fetch user from DB
                var user = _userService.GetUserByPhone(phone);

                if (user == null)
                    return NotFound(new { message = "User not found" });

                return Ok(user);
            }
            catch (SecurityTokenExpiredException)
            {
                return Unauthorized(new { message = "Token expired" });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Unauthorized(new { message = "Invalid token" });
            }
        }

    }

    // Request models
    public class SendOtpRequest
    {
        public string PhoneNumber { get; set; } = string.Empty;
    }

    public class VerifyOtpRequest
    {
        public string PhoneNumber { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
}
