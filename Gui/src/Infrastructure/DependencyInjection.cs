using Gui.Core.Domain.Tenants;
using Gui.Core.SharedKernel;
using Gui.Infrastructure.Persistence;
using Gui.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Gui.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MySqlConnection");

        services.AddDbContext<ApplicationContext>(options =>
            options.UseMySql(
                connectionString,
                ServerVersion.AutoDetect(connectionString)
                // b => b.MigrationsAssembly(typeof(GuiDbContext).Assembly.FullName))
                ));

        // services.AddScoped<IApplicationDbContext>(provider => provider.GetService<GuiDbContext>());

        // services.AddIdentity<ApplicationUser, IdentityRole>()
        //     .AddEntityFrameworkStores<GuiDbContext>()
        //     .AddDefaultTokenProviders();

        // services.AddTransient<IDateTime, DateTimeService>();
        // services.AddTransient<IIdentityService, IdentityService>();

        services.AddScoped<ITenantRepository, TenantRepository>();
        services.AddScoped<IUnitOfWork, ApplicationContext>();

        return services;
    }
}