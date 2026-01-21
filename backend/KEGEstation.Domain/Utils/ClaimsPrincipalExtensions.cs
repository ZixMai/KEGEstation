using System.Security.Claims;
using KEGEstation.Domain;

namespace KEGEstation.Domain.Utils;

public static class ClaimsPrincipalExtensions
{
    public static (long, Role?) GetIdAndRole(this ClaimsPrincipal user)
    {
        Role? role = null;
        if (!Enum.TryParse<Role>(user.FindFirst(ClaimTypes.Role)?.Value, ignoreCase: true, out var parsed))
        {
            role = parsed;
        }
        return (long.Parse(user.FindFirst("UserId")!.Value), role);
    } 
}