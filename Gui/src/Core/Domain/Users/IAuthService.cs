using FluentResults;

namespace Gui.Core.Domain.Users;

public interface IAuthService
{
    Task<Result<Guid>> RegisterUserAsync(string userName, string email, string password);
    Task<Result> LoginUserAsync(string userName, string password);
    Task LogoutUserAsync();
}