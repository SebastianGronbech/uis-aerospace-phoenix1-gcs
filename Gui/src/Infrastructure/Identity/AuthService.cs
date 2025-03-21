// Auth logic Implementation 

// microsfoft identity framework
using Microsoft.AspNetCore.Identity;

namespace Gui.Infrastructure.Identity;

public class AuthService
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;

    public AuthService(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<IdentityResult> RegisterUserAsync(string username, string password)
    {
        var user = new IdentityUser { UserName = username };
        
        return await _userManager.CreateAsync(user, password);
    }

    public async Task<SignInResult> LoginUserAsync(string username, string password)
    {
             
        return await _signInManager.PasswordSignInAsync(username, password, false, false);
    }
}