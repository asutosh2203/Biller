using Microsoft.AspNetCore.Mvc;
using Biller.Api.Services;
using Biller.Api.Models;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace Biller.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(UserService userService, JwtService jwtService) : ControllerBase
    {
        private readonly UserService _userService = userService;
        private readonly JwtService _jwtService = jwtService;

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


            // Create first time user
            try
            {
                User? user = await _userService.GetUserByPhoneAsync(request.PhoneNumber);
                user ??= await _userService.CreateUserAsync(request.PhoneNumber);

                // generate JWT
                var token = _jwtService.GenerateToken(user.Id.ToString(), user.PhoneNumber);
                return Ok(new { message = "Logged in", token, isNewUser = true, user });
            }
            catch (Exception ex)
            {
                // Log the exception (optional: use ILogger)
                Console.WriteLine(ex.Message);

                return StatusCode(500, new { message = "An error occurred while logging in." });
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
