using Microsoft.AspNetCore.Identity;

namespace Gui.Infrastructure.Identity;

public class AuthService
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;

    public AuthService(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
    {
        _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        _signInManager = signInManager ?? throw new ArgumentNullException(nameof(signInManager));
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