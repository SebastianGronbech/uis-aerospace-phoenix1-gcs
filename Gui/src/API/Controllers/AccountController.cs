using Microsoft.AspNetCore.Mvc;
using Gui.Infrastructure.Identity; 

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly AuthService _authService;

    public AccountController(AuthService authService)
    {
        _authService = authService;
    }



    // POST: api/Account/Register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
    {
        
        Console.WriteLine($"Register called with Username: {model.Username}, Password: {model.Password}, ConfirmPassword: {model.ConfirmPassword}");

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.RegisterUserAsync(model.Username, model.Password);
        if (result.Succeeded)
        {
            // Optionally, sign in the user if needed
            // await _authService.LoginUserAsync(model.Username, model.Password);
            return Ok("Registration successful");
        }

        // Log and return errors
        foreach (var error in result.Errors)
        {
            Console.WriteLine($"Registration error: {error.Description}");
            ModelState.AddModelError("", error.Description);
        }
        return BadRequest(ModelState);
    }

    // POST: api/Account/login
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginViewModel model)
{
    var username = model.Username;
    var password = model.Password;
    

    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    // Call the login method from AuthService
    var result = await _authService.LoginUserAsync(username, password);

    if (result.Succeeded)
    {
        return Ok("Login successful");
    }
    else
    {
        return Unauthorized("Invalid username or password");
    }
}


    // Nested view model for registration
    public class RegisterViewModel
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
    public class LoginViewModel
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}



