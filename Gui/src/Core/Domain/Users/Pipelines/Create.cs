using Gui.Core.SharedKernel;
using MediatR;

namespace Gui.Core.Domain.Users.Pipelines;

public class Create
{
    public record Request(Guid UserId, string Name) : IRequest<Response>;

    public record Response(bool Success, User? CreatedUser, string[] Errors);

    public class Handler : IRequestHandler<Request, Response>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public Handler(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            var existingUser = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (existingUser != null)
            {
                errors.Add("User with this ID already exists");
            }

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                errors.Add("Name cannot be empty");
            }

            if (errors.Count != 0)
            {
                return new Response(Success: false, null, errors.ToArray());
            }


            var user = User.Create(request.UserId, request.Name);

            _userRepository.Add(user);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new Response(true, user, Array.Empty<string>());
        }
    }
}