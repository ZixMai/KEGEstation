using System.Text.Json;

namespace KEGEstation.Domain;

public class User
{
    public long Id { get; set; }
    
    public string? Login { get; set; }
    public string UserFirstName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    
    public JsonElement? Contacts { get; set; }
    
    public string Role { get; set; } = nameof(Domain.Role.STUDENT);
    public bool IsDeleted { get; set; } = false;
    
    public string? PasswordHash { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public List<Kim> CreatedKims { get; set; } = [];
    public List<Result> Results { get; set; } = [];
}
