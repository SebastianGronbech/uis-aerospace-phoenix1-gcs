using Gui.Core.CommandAggregate;
using Gui.Core;
using Gui.Infrastructure;
using Gui.API.Notifiers;
using Gui.Core.Domain.Telemetry;
using Gui.API.Hubs;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDistributedMemoryCache();

builder.Services
    .AddCore()
    .AddInfrastructure(builder.Configuration);
    builder.Services.AddSingleton<ISubSystemNotifier, SignalRSubSystemNotifier>();
    builder.Services.AddScoped<CanService>();

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
             //.AllowAnyOrigin()
            .WithOrigins("http://192.168.1.101:5173","http://localhost:5173")
            
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(SendCommandHandler).Assembly);
    cfg.RegisterServicesFromAssembly(typeof(DeleteCommandHandler).Assembly);
});
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

// app.UseAuthorization();

app.MapControllers();

app.MapHub<DashBoardHub>("/dashboardHub");



app.Run();
