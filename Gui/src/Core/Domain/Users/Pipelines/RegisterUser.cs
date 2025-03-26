using FluentResults;
using Gui.Core.SharedKernel;
using MediatR;

namespace Gui.Core.Domain.Users.Pipelines;

public class RegisterUser
{
    public record Command(string UserName, string Email, string Password) : IRequest<Result<Guid>>;

    public class Handler : IRequestHandler<Command, Result<Guid>>
    {
        private readonly IAuthService _authService;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public Handler(IAuthService authService, IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<Result<Guid>> Handle(Command request, CancellationToken cancellationToken)
        {
            var result = await _authService.RegisterUserAsync(request.UserName, request.Email, request.Password);
            if (result.IsFailed)
            {
                return Result.Fail<Guid>(result.Errors);
            }

            var user = User.Create(result.Value, request.UserName);
            _userRepository.Add(user);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Ok(user.Id);
        }
    }
}