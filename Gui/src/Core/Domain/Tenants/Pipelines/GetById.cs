using MediatR;

namespace Gui.Core.Domain.Tenants.Pipelines;

public class GetById
{
    public record Request(Guid Id) : IRequest<Response>;

    public record Response(bool Success, Tenant? Tenant, string[] Errors);

    public class Handler : IRequestHandler<Request, Response>
    {
        private readonly ITenantRepository _tenantRepository;

        public Handler(ITenantRepository tenantRepository)
        {
            _tenantRepository = tenantRepository ?? throw new ArgumentNullException(nameof(tenantRepository));
        }

        public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
        {
            Console.WriteLine($"Tenant request Id: {request.Id}");
            var tenant = await _tenantRepository.GetByIdAsync(request.Id, cancellationToken);
            if (tenant == null)
            {
                return new Response(Success: false, null, ["Tenant not found"]);
            }

            return new Response(true, tenant, Array.Empty<string>());
        }
    }
}
