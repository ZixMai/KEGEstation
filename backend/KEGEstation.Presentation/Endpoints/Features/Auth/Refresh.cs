using KEGEstation.Application.Abstractions;
using KEGEstation.Application.Services;
using KEGEstation.Domain;
using KEGEstation.Domain.Utils;
using KEGEstation.Presentation.Groups;
using FastEndpoints.Security;
using Microsoft.AspNetCore.Identity.Data;

namespace KEGEstation.Presentation.Endpoints.Features.Auth;

using FastEndpoints;

public class RefreshEndpoint(
    IUserRepository userRepository,
    JwtService jwtService
) : EndpointWithoutRequest<TokenResponse>
{
    public override void Configure()
    {
        Post("/refresh");
        Group<AuthGroup>();
        Policies(ApiPolicies.IsTokenRefresh);
        
        Description(b => b
            .WithName("Refresh")
            .WithTags(RouteGroups.Auth)
            .Produces<TokenResponse>());
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var user = await userRepository.GetByIdAsync(User.GetIdAndRole().Item1, ct);
        if (user == null || user.PasswordHash == string.Empty || user.IsDeleted)
        {
            await Send.ForbiddenAsync(ct);
            return;
        }

        await Send.OkAsync(jwtService.GenerateTokenPair(user), ct);
    }
}