using Gui.Core.CommandAggregate;
using Gui.Core.Domain.Telemetry;
using Gui.Core.Domain.Users;
using Gui.Core.SharedKernel;
using Gui.Infrastructure.Identity;
using Gui.Infrastructure.Persistence;
using Gui.Infrastructure.Repositories;
using Gui.Infrastructure.Serial;
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

        services.AddIdentity();

        // services.AddTransient<IDateTime, DateTimeService>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<ApplicationContext>());
        services.AddScoped<ICommandRepository, EfCommandRepository>();
services.AddHostedService<SerialPortService>();
services.AddScoped<IPortSender, SerialPortService>(); // Allows injection into handlers
services.AddScoped<ICreateCommandRepository, EfCreateCommandRepository>();
services.AddScoped<IDeleteCommandRepository, EfDeleteCommandRepository>();
services.AddScoped<CanService>();  
        services.AddSingleton<IMessageRepository, MessageRepository>();
        // services.AddScoped<ISignalMeasurementRepository, SignalMeasurementRepository>();

        return services;
    }

    public static IServiceCollection AddIdentity(this IServiceCollection services)
    {
        services.AddIdentity<IdentityUser<Guid>, IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationContext>()
            .AddDefaultTokenProviders();

        services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 6;
            options.Password.RequireLowercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequiredUniqueChars = 1;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.AllowedForNewUsers = true;
            options.User.RequireUniqueEmail = true;
        });

        // services.AddDefaultIdentity<IdentityUser>(options =>
        //     options.SignIn.RequireConfirmedAccount = false)
        //     .AddEntityFrameworkStores<ApplicationContext>();

        return services;
    }
}