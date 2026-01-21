using KEGEstation.Domain;
using KEGEstation.Domain;
using FastEndpoints.Security;

namespace KEGEstation.Application.Services;

public class JwtService
{
    private readonly TimeSpan _accessTokenLifetime = TimeSpan.FromMinutes(30);
    private readonly TimeSpan _refreshTokenLifetime = TimeSpan.FromDays(1);

    public TokenResponse GenerateTokenPair(User user)
    {
        var accessTokenExpiry = DateTime.UtcNow.Add(_accessTokenLifetime);
        var refreshTokenExpiry = DateTime.UtcNow.Add(_refreshTokenLifetime);

        var accessToken = JwtBearer.CreateToken(
            o =>
            {
                o.ExpireAt = accessTokenExpiry;
                o.User["UserId"] = user.Id.ToString();
                o.User["Login"] = user.Login ?? "undefined";
                o.User.Roles.Add(user.Role);
                o.User["TokenType"] = "access";
            });

        var refreshToken = JwtBearer.CreateToken(
            o =>
            {
                o.ExpireAt = refreshTokenExpiry;
                o.User["UserId"] = user.Id.ToString();
                o.User["TokenType"] = "refresh";
            });

        return new TokenResponse
        {
            UserId = user.Id.ToString(),
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }
}