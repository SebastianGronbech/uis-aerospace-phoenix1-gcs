using FluentResults;
using Gui.Core.Domain.Users;
using Microsoft.AspNetCore.Identity;

namespace Gui.Infrastructure.Identity;

public class AuthService : IAuthService
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly SignInManager<IdentityUser<Guid>> _signInManager;

    public AuthService(UserManager<IdentityUser<Guid>> userManager, SignInManager<IdentityUser<Guid>> signInManager)
    {
        _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        _signInManager = signInManager ?? throw new ArgumentNullException(nameof(signInManager));
    }

    public async Task<Result<Guid>> RegisterUserAsync(string userName, string email, string password)
    {
        var user = new IdentityUser<Guid>
        {
            Id = Guid.NewGuid(),
            Email = email,
            UserName = userName
        };
        var result = await _userManager.CreateAsync(user, password);
        Console.WriteLine(result);
        if (!result.Succeeded)
        {
            return Result.Fail<Guid>(result.Errors.Select(e => new Error(e.Description)));
        }

        return Result.Ok(user.Id);
    }

    public async Task<Result> LoginUserAsync(string userName, string password)
    {
        var result = await _signInManager.PasswordSignInAsync(userName, password, false, false);
        if (!result.Succeeded)
        {
            return Result.Fail(result.ToString());
        }

        return Result.Ok();
    }

    public async Task LogoutUserAsync()
    {
        await _signInManager.SignOutAsync();
    }
}