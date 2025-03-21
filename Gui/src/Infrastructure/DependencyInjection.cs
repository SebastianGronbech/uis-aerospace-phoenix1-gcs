using Gui.Core.Domain.Users;
using Gui.Core.SharedKernel;
using Gui.Infrastructure.Identity;
using Gui.Infrastructure.Persistence;
using Gui.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
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
                )
                .EnableSensitiveDataLogging()
                .EnableDetailedErrors());
        // .LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information));

        // services.AddScoped<IApplicationDbContext>(provider => provider.GetService<GuiDbContext>());

        services.AddIdentity<IdentityUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationContext>()
            .AddDefaultTokenProviders();

        // services.AddTransient<IDateTime, DateTimeService>();

        // services.AddDefaultIdentity<IdentityUser>(options =>
        //     options.SignIn.RequireConfirmedAccount = false)
        //     .AddEntityFrameworkStores<ApplicationContext>();

        services.AddScoped<AuthService>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<ApplicationContext>());


        return services;
    }
}