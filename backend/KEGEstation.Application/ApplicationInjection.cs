using KEGEstation.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace KEGEstation.Application;

public static class ApplicationInjection
{
    public static IServiceCollection RegisterApplication(this IServiceCollection services)
    {
        services.AddSingleton<HashService>();
        services.AddSingleton<JwtService>();
        
        return services;
    }
}