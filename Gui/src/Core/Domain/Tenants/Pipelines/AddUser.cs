using Gui.Core.SharedKernel;
using MediatR;

namespace Gui.Core.Domain.Tenants.Pipelines;

public class AddUser
{
    public record Request(Guid TenantId, Guid UserId) : IRequest<Response>;

    public record Response(bool Success, string[] Errors);

    public class Handler : IRequestHandler<Request, Response>
    {
        private readonly ITenantRepository _tenantRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public Handler(ITenantRepository tenantRepository, IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _tenantRepository = tenantRepository ?? throw new ArgumentNullException(nameof(tenantRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
        {
            var tenant = await _tenantRepository.GetByIdAsync(request.TenantId, cancellationToken);
            if (tenant == null)
            {
                return new Response(Success: false, [$"Tenant with ID {request.TenantId} not found."]);
            }

            try
            {
                tenant.AddUser(request.UserId);
            }
            catch (InvalidOperationException ex)
            {
                return new Response(Success: false, [ex.Message]);
            }

            _userRepository.Add(tenant.Users.First(u => u.Id == request.UserId));

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new Response(true, Array.Empty<string>());
        }
    }
}