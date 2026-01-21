using System.Security.Claims;
using System.Text.Json;
using KEGEstation.Presentation.Middlewares;
using FastEndpoints;
using FastEndpoints.Swagger;
using Serilog;

namespace KEGEstation.Presentation.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication ConfigureHttpPipeline(
        this WebApplication app,
        IWebHostEnvironment env)
    {
        app.UseCors(cors => cors
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin());

        app.UseSerilogRequestLogging();

        app.UseMiddleware<RetryMiddleware>();

        app.UseDefaultExceptionHandler();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseFastEndpoints(c =>
        {
            c.Security.RoleClaimType = ClaimTypes.Role;
            c.Endpoints.RoutePrefix = "api/v1";
            c.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;

            c.Endpoints.Configurator = ep =>
            {
                ep.Description(b => b
                    .Produces<ErrorResponse>(400, "application/problem+json")
                    .Produces<ProblemDetails>(500));
                
                var isAnonymous = ep.AnonymousVerbs is { Length: > 0 };
                var isRefreshEndpoint = ep.PreBuiltUserPolicies?.Contains(ApiPolicies.IsTokenRefresh) == true;
                if (isAnonymous || isRefreshEndpoint) { return; }
                
                ep.Policies(ApiPolicies.IsTokenAccess);
            };
        });

        app.UseSwaggerGen();

        if (env.IsDevelopment())
            app.MapOpenApi();

        app.UseHttpsRedirection();

        return app;
    }
}