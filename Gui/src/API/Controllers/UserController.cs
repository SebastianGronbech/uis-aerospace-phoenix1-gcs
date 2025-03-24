using Gui.Core.Domain.Users.Pipelines;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Gui.API.Controllers;

[ApiController]
[Route("api/users/{userId}/[controller]")]
public class RolesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<RolesController> _logger;

    public RolesController(IMediator mediator, ILogger<RolesController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    // [HttpPost]
    // public async Task<IActionResult> AddRole(Guid userId, [FromBody] SetRole.Command request, CancellationToken cancellationToken)
    // {
    //     _logger.LogInformation("Adding role: {Role} to user with ID: {UserId} for the unit with ID: {UnitId}", request.Role, userId, request.UnitId);
    //     var result = await _mediator.Send(request, cancellationToken);
    //     // var addUserRequest = new AddUser.Request(tenantId, request.UserId);
    //     // var result = await _mediator.Send(addUserRequest, cancellationToken);

    //     if (!result.Success)
    //     {
    //         return BadRequest(result.Errors);
    //     }

    //     // return CreatedAtAction(nameof(GetUsers), new { tenantId = tenantId }, result);
    //     return Created();
    // }
}