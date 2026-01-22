using System.Text.Json;

namespace KEGEstation.Domain;

public class KimTask
{
    public long Id { get; set; }
    
    public long CreatorId { get; set; }
    public User Creator { get; set; }
    
    public string? Description { get; set; }
    
    public List<string> ImageS3Keys { get; set; } = [];
    public List<string> FileS3Keys { get; set; } = [];
    
    public short? Number { get; set; }
    
    public string Answer { get; set; }
    public short AnswerColumnsSize { get; set; } = 1;
    public short AnswerRowsSize { get; set; } = 1;

    public List<KimToTask> KimsForTask { get; set; } = [];
}
