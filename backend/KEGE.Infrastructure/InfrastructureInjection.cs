using KEGEstation.Application.Abstractions;
using KEGEstation.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace KEGEstation.Infrastructure;

public static class InfrastructureInjection
{
    public static IServiceCollection RegisterInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var config = configuration.GetRequiredSection(nameof(DbConfiguration)).Get<DbConfiguration>();

        services.AddDbContext<DbContext>(options =>
        {
            options.UseNpgsql(config!.CreateConnectionString());
        });
        
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IKimRepository, KimRepository>();
        services.AddScoped<IKimTaskRepository, KimTaskRepository>();
        services.AddScoped<IResultRepository, ResultRepository>();
        
        return services;
    }
}
