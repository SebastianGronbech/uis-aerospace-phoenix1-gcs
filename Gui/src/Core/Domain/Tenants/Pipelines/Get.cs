using MediatR;

namespace Gui.Core.Domain.Tenants.Pipelines;

public class Get
{
    public record Request : IRequest<List<Tenant>>;

    public class Handler : IRequestHandler<Request, List<Tenant>>
    {
        private readonly ITenantRepository _tenantRepository;

        public Handler(ITenantRepository tenantRepository)
        {
            _tenantRepository = tenantRepository ?? throw new ArgumentNullException(nameof(tenantRepository));
        }

        public async Task<List<Tenant>> Handle(Request request, CancellationToken cancellationToken)
        {
            return await _tenantRepository.GetAllAsync(cancellationToken);
        }
    }
}