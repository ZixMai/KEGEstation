using System.Text.Json;

namespace KEGEstation.Domain;

public class User
{
    public long Id { get; set; }
    
    public string? Login { get; set; }
    
    public string LastName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Patronymic { get; set; } = string.Empty;
    public string School { get; set; } = string.Empty;
    public string SchoolClassName { get; set; } = string.Empty;
    public string Locality { get; set; } = string.Empty;
    
    public string Role { get; set; } = nameof(Domain.Role.STUDENT);
    public bool IsDeleted { get; set; }
    
    public string? PasswordHash { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public List<Kim> CreatedKims { get; set; } = [];
    public List<KimTask> CreatedTasks { get; set; } = [];
    public List<Result> Results { get; set; } = [];
}
