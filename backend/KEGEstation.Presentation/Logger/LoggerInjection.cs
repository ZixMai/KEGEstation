using Microsoft.AspNetCore.HttpLogging;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Enrichers.Span;
using Serilog.Exceptions;
using Serilog.Exceptions.Core;
using Serilog.Exceptions.EntityFrameworkCore.Destructurers;
using Serilog.Sinks.OpenTelemetry;
using Serilog.Templates.Themes;
using SerilogTracing.Expressions;

namespace KEGEstation.Presentation.Logger;

public static class LoggerInjection
{
    private static LoggerConfiguration EnrichLoggerConfiguration(LoggerConfiguration loggerConfiguration) =>
        loggerConfiguration.MinimumLevel.Information()
            .Enrich.FromLogContext()
            .Enrich.WithClientIp()
            .Enrich.WithCorrelationId()
            .Enrich.WithRequestHeader("x-trace-id")
            .Enrich.WithSpan()
            .Enrich.WithExceptionDetails(
                new DestructuringOptionsBuilder()
                    .WithDefaultDestructurers()
                    .WithDestructurers([new DbUpdateExceptionDestructurer()])
            )
            .WriteTo.Console(Formatters.CreateConsoleTextFormatter(TemplateTheme.Code));

    private static LoggerConfiguration EnrichLoggerWithOpenTelemetry(LoggerConfiguration enrichedConfiguration,
        OTelConfiguration oTelConfiguration, Resource resource) =>
        enrichedConfiguration.WriteTo.OpenTelemetry(options =>
        {
            options.Endpoint = oTelConfiguration.GetHttpEndpoint();
            options.Protocol = OtlpProtocol.HttpProtobuf;
            options.ResourceAttributes = resource.Attributes.ToDictionary();
        });

    private static void ConfigureOtlpExporterOptions(OtlpExporterOptions options, OTelConfiguration oTelConfiguration)
    {
        options.Endpoint = new Uri(oTelConfiguration.GetGrpcEndpoint());
        options.Protocol = OtlpExportProtocol.Grpc;
    }

    extension(IServiceCollection services)
    {
        public void ConfigureBootstrapLogger()
        {
            services.AddHttpLogging(options =>
                {
                    options.LoggingFields = HttpLoggingFields.All;
                    options.ResponseBodyLogLimit = 12 * 1024;
                }
            );
            Log.Logger = EnrichLoggerConfiguration(new LoggerConfiguration()).CreateBootstrapLogger();
        }

        public void ConfigureSerilog(IConfiguration configuration)
        {
            var oTelSection = configuration.GetSection(nameof(OTelConfiguration));

            services.AddSerilog((serviceProvider, lc) =>
            {
                var logConfig = EnrichLoggerConfiguration(lc);
                if (oTelSection.Exists())
                {
                    var resourceDetector = serviceProvider.GetRequiredService<ResourceDetector>();
                    var resource = resourceDetector.Detect();
                    logConfig = EnrichLoggerWithOpenTelemetry(logConfig, oTelSection.Get<OTelConfiguration>()!,
                        resource);
                }

                logConfig.ReadFrom.Services(serviceProvider);
            });
        }

        public void ConfigureOTel(IConfiguration configuration)
        {
            var oTelSection = configuration.GetSection(nameof(OTelConfiguration));
            services.AddOpenTelemetry()
                .ConfigureResource(builder =>
                    builder.AddDetector(sp => sp.GetRequiredService<ResourceDetector>()))
                .WithTracing(tracing =>
                {
                    var builder = tracing
                        .AddAspNetCoreInstrumentation()
                        .AddHttpClientInstrumentation();
                    if (!oTelSection.Exists()) return;
                    var oTelConfig = oTelSection.Get<OTelConfiguration>()!;
                    builder.AddOtlpExporter(options => ConfigureOtlpExporterOptions(options, oTelConfig));
                })
                .WithMetrics(metrics =>
                {
                    var builder = metrics
                        .AddAspNetCoreInstrumentation()
                        .AddHttpClientInstrumentation()
                        .AddRuntimeInstrumentation();
                    if (!oTelSection.Exists()) return;
                    var oTelConfig = oTelSection.Get<OTelConfiguration>()!;
                    builder.AddOtlpExporter(options => ConfigureOtlpExporterOptions(options, oTelConfig));
                });
        }
    }
}