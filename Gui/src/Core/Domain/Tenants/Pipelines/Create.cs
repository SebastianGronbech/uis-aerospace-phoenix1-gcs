using MediatR;

namespace Gui.Core.Domain.Tenants.Pipelines;

public class Create
{
    public record Request(string Name) : IRequest<Response>;

    public record Response(bool Success, Tenant? CreatedTenant, string[] Errors);

    public class Handler : IRequestHandler<Request, Response>
    {
        private readonly ITenantRepository _tenantRepository;

        public Handler(ITenantRepository tenantRepository)
        {
            _tenantRepository = tenantRepository ?? throw new ArgumentNullException(nameof(tenantRepository));
        }

        public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                errors.Add("Name cannot be empty");
            }

            var existingTenant = await _tenantRepository.GetByNameAsync(request.Name, cancellationToken);
            if (existingTenant != null)
            {
                errors.Add("Tenant with this name already exists");
            }

            if (errors.Count != 0)
            {
                return new Response(Success: false, null, errors.ToArray());
            }

            var tenant = new Tenant(Guid.NewGuid(), request.Name);

            await _tenantRepository.AddAsync(tenant, cancellationToken);

            return new Response(true, tenant, Array.Empty<string>());
        }
    }
}