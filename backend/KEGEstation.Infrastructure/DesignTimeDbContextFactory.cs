using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace KEGEstation.Infrastructure;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DbContext>
{
    public DbContext CreateDbContext(string[] args)
    {
        var environment =
            Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT")
            ?? Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
            ?? "Development";

        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile($"appsettings.{environment}.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var config = configuration.GetRequiredSection(nameof(DbConfiguration)).Get<DbConfiguration>();

        var optionsBuilder = new DbContextOptionsBuilder<DbContext>();

        optionsBuilder.UseNpgsql(config?.CreateConnectionString() ??
                                 "Host=localhost;Database=dummy;Username=dummy;Password=dummy");
        return new DbContext(optionsBuilder.Options);
    }
}