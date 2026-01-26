using KEGEstation.Application.Abstractions;
using KEGEstation.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace KEGEstation.Infrastructure;

public static class InfrastructureInjection
{
    public static IServiceCollection RegisterInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var config = configuration.GetRequiredSection(nameof(DbConfiguration)).Get<DbConfiguration>();

        var dataSourceBuilder = new NpgsqlDataSourceBuilder(config!.CreateConnectionString());
        dataSourceBuilder.EnableDynamicJson();
        var dataSource = dataSourceBuilder.Build();

        services.AddDbContext<DbContext>(options =>
        {
            options.UseNpgsql(dataSource);
        });
        
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IKimRepository, KimRepository>();
        services.AddScoped<IKimTaskRepository, KimTaskRepository>();
        services.AddScoped<IResultRepository, ResultRepository>();
        
        return services;
    }
}
