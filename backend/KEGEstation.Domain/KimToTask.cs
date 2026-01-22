namespace KEGEstation.Domain;

public class KimToTask
{
    public long KimId { get; set; }
    public Kim Kim { get; set; } = null!;
    public long TaskId { get; set; }
    public KimTask Task { get; set; } = null!;
}