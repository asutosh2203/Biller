using Microsoft.AspNetCore.Mvc;
using Biller.Api.Services;
using Biller.Api.Models;
using Biller.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Biller.Api.Models.Requests;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Biller.Api.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class UserController(AppDbContext appDbContext, UserService userService) : ControllerBase
    {
        private readonly AppDbContext _db = appDbContext;
        private readonly UserService _userService = userService;

        [Authorize]
        [HttpPost("onboarding")]
        public async Task<IActionResult> SetOnboardingData([FromBody] OnboardingRequest request)
        {
            try
            {
                if (!Guid.TryParse(request.UserId.ToString(), out Guid userGuid))
                    return BadRequest("Invalid UserId");

                BusinessProfile business = await _userService.SetOnboardingData(userGuid, request);
                return Ok(business);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }
    }

}