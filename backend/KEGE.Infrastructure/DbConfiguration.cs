namespace KEGEstation.Infrastructure;

public class DbConfiguration
{
    public string? Server { get; init; }
    public int Port { get; init; }
    public string? User { get; init; }
    public string? Database { get; init; }
    public string? Password { get; init; }
    private bool Pooling { get; set; } = true;
    private int MinPoolSize { get; set; } = 10;
    private int MaxPoolSize { get; set; } = 100;
    private int CommandTimeout { get; set; } = 5;
    
    public string CreateConnectionString()
    {
        return $"Host={Server}; " +
               $"Port={Port}; " +
               $"Database={Database}; " +
               $"Username={User}; " +
               $"Password={Password};" +
               $"Pooling={Pooling};" +
               $"Minimum Pool Size={MinPoolSize};" +
               $"Maximum Pool Size={MaxPoolSize};" +
               $"Command Timeout={CommandTimeout};";
    }
}