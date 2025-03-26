using Microsoft.AspNetCore.Mvc;
using MediatR;
using Gui.Core.Domain.Users.Pipelines;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ISender _mediator;

    public AuthController(ISender mediator)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUser.Command request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new RegisterUser.Command(
                request.UserName,
                request.Email,
                request.Password
            ), cancellationToken
        );

        if (result.IsFailed)
        {
            return BadRequest(result.Errors);
        }

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUser.Command request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new LoginUser.Command(
                request.UserName,
                request.Password
            ), cancellationToken
        );

        if (result.IsFailed)
        {
            return Unauthorized(result.Errors);
        }

        return Ok();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        await _mediator.Send(new LogoutUser.Command(), cancellationToken);

        return Ok();
    }
}