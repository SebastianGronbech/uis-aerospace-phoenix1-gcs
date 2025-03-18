using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace Gui.Core;

public static class DependencyInjection
{
    public static IServiceCollection AddCore(this IServiceCollection services)
    {
        // builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<DependencyInjection>());
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        // services.AddAutoMapper(typeof(DependencyInjection).Assembly);

        return services;
    }
}