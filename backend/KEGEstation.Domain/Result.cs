namespace KEGEstation.Domain;

public class Result
{
    public long KimId { get; set; }
    public Kim Kim { get; set; } = null!;
    
    public long UserId { get; set; }
    public User User { get; set; } = null!;
    
    public short ResultValue { get; set; } = 0;
    
    public List<string> Metadata { get; set; } = [];
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
