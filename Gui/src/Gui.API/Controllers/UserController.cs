using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Gui.API.Data;
using Gui.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Gui.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("profile")]
        [Authorize] 
        public async Task<IActionResult> GetUserProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found.");
            }

            int userId = int.Parse(userIdClaim.Value);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new
            {
                Id = user.Id,
                Username = user.Username
            });
        }
    }
}
