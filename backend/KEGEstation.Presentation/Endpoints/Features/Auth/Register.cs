using KEGEstation.Application.Abstractions;
using KEGEstation.Application.Services;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints;
using FastEndpoints.Security;
using FluentValidation;
using Microsoft.AspNetCore.Identity.Data;

namespace KEGEstation.Presentation.Endpoints.Features.Auth;


public class RegisterEndpoint(
    IUserRepository userRepository,
    HashService hashService,
    JwtService jwtService
) : Endpoint<RegisterRequest, TokenResponse>
{
    public override void Configure()
    {
        Post("/register");
        Group<AuthGroup>();
        AllowAnonymous();
        
        Description(b => b
            .WithName("Register")
            .WithTags(RouteGroups.Auth)
            .Produces<TokenResponse>());
    }
    
    internal sealed class Validator : Validator<RegisterRequest>
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

    public override async Task HandleAsync(RegisterRequest req, CancellationToken ct)
    {
        var user = await userRepository.GetByLoginAsync(req.Email, ct);
        if (user is not null && user.PasswordHash != string.Empty)
        {
            AddError("User with the same email already exists.");
            await Send.UnauthorizedAsync(ct);
            return;
        }

        if (user?.IsDeleted ?? false)
        {
            AddError("User is deleted.");
            await Send.ForbiddenAsync(ct);
            return;
        }
        user ??= new User { Login = req.Email };
        var passwordHash = hashService.HashPassword(req.Password);
        user.PasswordHash = passwordHash;
        await userRepository.CreateAsync(user, ct);
        
        await Send.OkAsync(jwtService.GenerateTokenPair(user), ct);
    }
}