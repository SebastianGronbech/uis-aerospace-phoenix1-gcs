using Gui.Core.Exceptions;
using MediatR;

namespace Gui.Core.Domain.Tenants.Pipelines;

public class RemoveUser
{
    public record Request(Guid TenantId, Guid UserId) : IRequest<Response>;

    public record Response(bool Success, string[] Errors);

    public class Handler : IRequestHandler<Request, Response>
    {
        private readonly ITenantRepository _tenantRepository;

        public Handler(ITenantRepository tenantRepository)
        {
            _tenantRepository = tenantRepository ?? throw new ArgumentNullException(nameof(tenantRepository));
        }

        public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
        {
            var tenant = await _tenantRepository.GetByIdAsync(request.TenantId, cancellationToken);
            if (tenant == null)
            {
                return new Response(Success: false, ["Tenant not found"]);
            }

            try
            {
                tenant.RemoveUser(request.UserId);
            }
            catch (EntityNotFoundException ex)
            {
                return new Response(Success: false, [ex.Message]);
            }

            await _tenantRepository.UpdateAsync(tenant, cancellationToken);

            return new Response(true, Array.Empty<string>());
        }
    }
}