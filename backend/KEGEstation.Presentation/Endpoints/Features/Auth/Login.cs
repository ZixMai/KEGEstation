using KEGEstation.Application.Abstractions;
using KEGEstation.Application.Services;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints.Security;
using FluentValidation;
using Microsoft.AspNetCore.Identity.Data;

namespace KEGEstation.Presentation.Endpoints.Features.Auth;

using FastEndpoints;

public class LoginEndpoint(
    IUserRepository userRepository,
    HashService hashService,
    JwtService jwtService) : Endpoint<LoginRequest, TokenResponse>
{
    public override void Configure()
    {
        Post("/login");
        Group<AuthGroup>();
        AllowAnonymous();
        
        Description(b => b
            .WithName("Login")
            .WithTags(RouteGroups.Auth)
            .Produces<TokenResponse>());
    }
    
    internal sealed class Validator : Validator<LoginRequest>
    {
        public Validator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email обязателен.")
                .EmailAddress().WithMessage("Email некорректный.")
                .MaximumLength(256);

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Пароль обязателен.")
                .MinimumLength(8).WithMessage("Пароль должен быть минимум 8 символов.")
                .MaximumLength(128)
                .Must(p => !p.Any(char.IsWhiteSpace)).WithMessage("Пароль не должен содержать пробелы.")
                .Matches(@"[A-Za-z]").WithMessage("Пароль должен содержать хотя бы одну букву.")
                .Matches(@"\d").WithMessage("Пароль должен содержать хотя бы одну цифру.");
        }
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        var user = await userRepository.GetByLoginAsync(req.Email, ct);
        if (user == null || user.PasswordHash == string.Empty || user.IsDeleted)
        {
            await Send.NotFoundAsync(ct);
            return;
        }
        
        if (!hashService.VerifyPassword(req.Password, user.PasswordHash!))
        {
            await Send.UnauthorizedAsync(ct);
            return;
        }

        await Send.OkAsync(jwtService.GenerateTokenPair(user), ct);
    }
}