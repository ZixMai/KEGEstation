using System.Text.Json;

namespace KEGEstation.Domain;

public class KimTask
{
    public long Id { get; set; }
    
    public long CreatorId { get; set; }
    public User Creator { get; set; }
    
    public string Text { get; set; } = string.Empty;
    
    public string ImageS3Keys { get; set; } = "[]";
    public string FileS3Keys { get; set; } = "[]";
    
    public short? Number { get; set; }
    
    public string Key { get; set; }
    public short AnswerColumnsSize { get; set; } = 1;
    public short AnswerRowsSize { get; set; } = 1;

    public List<KimToTask> KimsForTask { get; set; } = [];
}
