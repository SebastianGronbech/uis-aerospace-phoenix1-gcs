// using Gui.Core.SharedKernel;
// using MediatR;

// namespace Gui.Core.Domain.Users.Pipelines;

// public class SetRole
// {
//     public record Command(Guid UserId, Guid UnitId, string Role) : IRequest<Response>;

//     public record Response(bool Success, string[] Errors);

//     public class Handler : IRequestHandler<Command, Response>
//     {
//         private readonly IUserRepository _userRepository;
//         private readonly IUnitRepository _unitRepository;
//         private readonly IUnitOfWork _unitOfWork;

//         public Handler(IUserRepository userRepository, IUnitRepository unitRepository, IUnitOfWork unitOfWork)
//         {
//             _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
//             _unitRepository = unitRepository ?? throw new ArgumentNullException(nameof(unitRepository));
//             _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
//         }

//         public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
//         {
//             var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
//             if (user == null)
//             {
//                 return new Response(Success: false, [$"User with ID {request.UserId} not found."]);
//             }

//             var unit = await _unitRepository.GetByIdAsync(request.UnitId, cancellationToken);
//             if (unit == null)
//             {
//                 return new Response(Success: false, [$"Unit with ID {request.UnitId} not found."]);
//             }

//             if (!Enum.TryParse<UserRole>(request.Role, out var userRole))
//             {
//                 return new Response(Success: false, [$"Invalid role: {request.Role}."]);
//             }

//             user.SetRole(unit.Id, userRole);

//             await _unitOfWork.SaveChangesAsync(cancellationToken);

//             return new Response(true, Array.Empty<string>());
//         }
//     }
// }