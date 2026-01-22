using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using KEGEstation.Presentation.Middlewares;
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Serilog;
using DbContext = KEGEstation.Infrastructure.DbContext;

namespace KEGEstation.Presentation.Extensions;

public static class WebApplicationExtensions
{
    public static async Task<WebApplication> ApplyMigrationsAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        
        try
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<DbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbContext>>();
            
            logger.LogInformation("Applying database migrations...");
            await dbContext.Database.MigrateAsync();
            logger.LogInformation("Database migrations applied successfully");
        }
        catch (Exception ex)
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbContext>>();
            logger.LogError(ex, "An error occurred while migrating the database");
            throw;
        }

        var s3Client = scope.ServiceProvider.GetRequiredService<IAmazonS3>();
        var exists = await AmazonS3Util.DoesS3BucketExistV2Async(s3Client, "files");

        if (exists) { return app; }

        var putRequest = new PutBucketRequest
        {
            BucketName = "files",
            UseClientRegion = true
        };
        await s3Client.PutBucketAsync(putRequest);
        
        return app;
    }
    
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
            c.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            c.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            c.Binding.UsePropertyNamingPolicy = false;

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