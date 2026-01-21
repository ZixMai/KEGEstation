using OpenTelemetry.Resources;

namespace KEGEstation.Presentation.Logger;

public class ResourceDetector(IWebHostEnvironment webHostEnvironment) : IResourceDetector
{
    public Resource Detect()
    {
        return ResourceBuilder.CreateEmpty()
            .AddService(serviceName: webHostEnvironment.ApplicationName)
            .AddAttributes(new Dictionary<string, object> { ["host.environment"] = webHostEnvironment.EnvironmentName })
            .Build();
    }
}