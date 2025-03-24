// using Gui.Core.Domain.Tenants.Pipelines;
// using MediatR;
// using Microsoft.AspNetCore.Mvc;

// namespace Gui.API.Controllers;

// [ApiController]
// [Route("api/[controller]")]
// public class TenantsController : ControllerBase
// {
//     private readonly IMediator _mediator;
//     private readonly ILogger<TenantsController> _logger;

//     public TenantsController(IMediator mediator, ILogger<TenantsController> logger)
//     {
//         _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
//         _logger = logger ?? throw new ArgumentNullException(nameof(logger));
//     }

//     [HttpGet("{id}")]
//     public async Task<IActionResult> GetTenantById(Guid id, CancellationToken cancellationToken)
//     {
//         var result = await _mediator.Send(new GetById.Request(id), cancellationToken);

//         if (!result.Success)
//         {
//             return NotFound();
//         }

//         return Ok(result.Tenant);
//     }

//     [HttpPost]
//     public async Task<IActionResult> CreateTenant([FromBody] Create.Request request, CancellationToken cancellationToken)
//     {
//         _logger.LogInformation("Creating tenant with name: {Name}", request.Name);
//         var result = await _mediator.Send(request, cancellationToken);

//         if (!result.Success)
//         {
//             return BadRequest(result.Errors);
//         }

//         return CreatedAtAction(nameof(GetTenantById), new { id = result.CreatedTenant!.Id }, result.CreatedTenant);
//     }

//     [HttpGet]
//     public async Task<IActionResult> GetTenants(CancellationToken cancellationToken)
//     {
//         var result = await _mediator.Send(new Get.Request(), cancellationToken);

//         return Ok(result);
//     }
// }
