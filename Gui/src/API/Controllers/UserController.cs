using Gui.Core.Domain.Tenants.Pipelines;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Gui.API.Controllers;

[ApiController]
[Route("api/tenants/{tenantId}/users")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<UserController> _logger;

    public UserController(IMediator mediator, ILogger<UserController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    // [HttpGet]
    // public async Task<IActionResult> GetUsers(Guid tenantId, CancellationToken cancellationToken)
    // {
    //     var result = await _mediator.Send(new GetUsers.Request(tenantId), cancellationToken);

    //     return Ok(result);
    // }

    [HttpPost]
    public async Task<IActionResult> AddUser(Guid tenantId, [FromBody] AddUser.Request request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Adding user with ID: {UserId} to tenant with ID: {TenantId}", request.UserId, tenantId);
        var addUserRequest = new AddUser.Request(tenantId, request.UserId);
        var result = await _mediator.Send(addUserRequest, cancellationToken);

        if (!result.Success)
        {
            return BadRequest(result.Errors);
        }

        // return CreatedAtAction(nameof(GetUsers), new { tenantId = tenantId }, result);
        return Created();
    }

    // [HttpPost]
    // public async Task<IActionResult> CreateUser(Guid tenantId, [FromBody] CreateUser.Request request, CancellationToken cancellationToken)
    // {
    //     _logger.LogInformation($"Creating user with name: {request.Name}");
    //     var result = await _mediator.Send(request, cancellationToken);

    //     if (!result.Success)
    //     {
    //         return BadRequest(result.Errors);
    //     }

    //     return CreatedAtAction(nameof(GetUsers), new { tenantId = tenantId }, result.CreatedUser);
    // }
}