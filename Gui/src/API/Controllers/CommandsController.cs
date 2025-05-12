using Gui.Core.CommandAggregate;

using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Gui.Api.Controllers;

[ApiController]
[Route("api/commands")]
public class CommandsController : ControllerBase
{
    private readonly IMediator _mediator;

    public CommandsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // POST /api/commands - creates a command
    [HttpPost]
    public async Task<IActionResult> CreateCommand([FromBody] CreateCommandRequest request)
    {
        var id = await _mediator.Send(request);
        return Ok(new { id });
    }

    [HttpPost("{publicId}/send")]
    public async Task<IActionResult> SendCommand(string publicId)
    {
        var result = await _mediator.Send(new SendCommandRequest { PublicId = publicId });
        return Ok(result);
    }

    [HttpDelete("{publicId}")]
    public async Task<IActionResult> DeleteCommand(string publicId)
    {
        var result = await _mediator.Send(new DeleteCommandRequest { PublicId = publicId });
        return result ? Ok("Command deleted.") : NotFound("Command not found.");
    }

}
