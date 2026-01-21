namespace KEGEstation.Presentation.Logger;

public class OTelConfiguration
{
    public string OTelHost { get; set; }
    public int OTelHttpPort { get; set; }
    public int OTelGrpcPort { get; set; }
    
    public string GetHttpEndpoint() => $"http://{OTelHost}:{OTelHttpPort}";
    
    public string GetGrpcEndpoint() => $"http://{OTelHost}:{OTelGrpcPort}";
}