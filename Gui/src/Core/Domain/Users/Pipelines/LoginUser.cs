using FluentResults;
using MediatR;

namespace Gui.Core.Domain.Users.Pipelines;

public class LoginUser
{
    public record Command(string UserName, string Password) : IRequest<Result<Guid>>;

    public class Handler : IRequestHandler<Command, Result<Guid>>
    {
        private readonly IAuthService _authService;

        public Handler(IAuthService authService)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
        }

        public async Task<Result<Guid>> Handle(Command request, CancellationToken cancellationToken)
        {
            var result = await _authService.LoginUserAsync(request.UserName, request.Password);
            if (result.IsFailed)
            {
                return Result.Fail<Guid>(result.Errors);
            }

            return Result.Ok(Guid.NewGuid());
        }
    }
}