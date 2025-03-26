using MediatR;

namespace Gui.Core.Domain.Users.Pipelines;

public class LogoutUser
{
    public record Command : IRequest<Unit>;

    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly IAuthService _authService;

        public Handler(IAuthService authService)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
        }

        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            await _authService.LogoutUserAsync();
            return Unit.Value;
        }
    }
}