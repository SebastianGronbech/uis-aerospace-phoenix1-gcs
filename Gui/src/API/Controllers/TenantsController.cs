using Gui.Core.Domain.Tenants.Pipelines;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Gui.API.Controllers;

[ApiController]
// [Route("[controller]")]
[Route("api/[controller]")]
// [Route("api/tenants")]
public class TenantsController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly IMediator _mediator;
    private readonly ILogger<TenantsController> _logger;

    public TenantsController(IMediator mediator, ILogger<TenantsController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTenantById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetById.Request(id), cancellationToken);

        if (!result.Success)
        {
            return NotFound();
        }

        return Ok(result.Tenant);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTenant([FromBody] Create.Request request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(request, cancellationToken);

        if (!result.Success)
        {
            return BadRequest(result.Errors);
        }

        return CreatedAtAction(nameof(GetTenantById), new { id = result.CreatedTenant!.Id }, result.CreatedTenant);
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}
