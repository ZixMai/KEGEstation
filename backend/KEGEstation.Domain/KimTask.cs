using System.Text.Json;

namespace KEGEstation.Domain;

public class KimTask
{
    public long Id { get; set; }
    
    public long KimId { get; set; }
    public Kim Kim { get; set; } = null!;
    
    public string? Description { get; set; }
    
    public List<string> ImageS3Keys { get; set; } = [];
    public List<string> FileS3Keys { get; set; } = [];
    
    public short? Number { get; set; }
    
    public JsonElement Answer { get; set; }
    public short AnswerColumnsSize { get; set; } = 1;
    public short AnswerRowsSize { get; set; } = 1;
}
