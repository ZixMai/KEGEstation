using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace KEGEstation.Domain.Utils;

public class JsonConverter
{
    private static readonly JsonSerializerOptions DefaultOptions = new ()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.Never,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        IgnoreReadOnlyFields = false,
        IgnoreReadOnlyProperties = true,
        IncludeFields = true,
        NumberHandling = JsonNumberHandling.Strict,
        PreferredObjectCreationHandling = JsonObjectCreationHandling.Replace,
        PropertyNameCaseInsensitive = true,
        WriteIndented = true,
        Converters = { new JsonStringEnumConverter() },
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static List<T> MapJsonToCollection<T>(string? json) => JsonSerializer.Deserialize<List<T>>(
        json ?? "[]",
        DefaultOptions
    ) ?? [];
    
    public static string MapCollectionToJson<T>(List<T>? collection) => JsonSerializer.Serialize(
        collection ?? [],
        DefaultOptions
    );
}