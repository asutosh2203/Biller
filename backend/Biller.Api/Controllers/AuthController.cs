using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Concurrent;

namespace Biller.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        // In-memory OTP store for now (replace later with DB or cache)
        private static readonly ConcurrentDictionary<string, (string Otp, DateTime Expiry)> _otpStore = new();

        // POST: api/auth/send-otp
        [HttpPost("send-otp")]
        public IActionResult SendOtp([FromBody] SendOtpRequest request)
        {
            Console.WriteLine("Phone number:", request.PhoneNumber);
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
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            Console.WriteLine( request.PhoneNumber);
            Console.WriteLine( request.Otp);
            if (!_otpStore.TryGetValue(request.PhoneNumber, out var otpData))
                return BadRequest("No OTP found. Please request a new one.");

            if (DateTime.UtcNow > otpData.Expiry)
                return BadRequest("OTP has expired.");

            if (otpData.Otp != request.Otp)
                return Unauthorized("Invalid OTP.");

            // Success — clear OTP and issue token (later we’ll add JWT)
            _otpStore.TryRemove(request.PhoneNumber, out _);

            return Ok(new { message = "OTP verified successfully.", token = "dummy-jwt-placeholder" });
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
