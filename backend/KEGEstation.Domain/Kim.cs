namespace KEGEstation.Domain;

public class Kim
{
    public long Id { get; set; }
    
    public long CreatorId { get; set; }
    public User Creator { get; set; } = null!;
    
    public string? Description { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string UnlockCode { get; set; } = "MAI8";
    
    // Navigation properties
    public List<Result> Results { get; set; } = [];
    public List<KimToTask> TasksForKim { get; set; } = [];
}
