using System.Text.Json;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints;
using FluentValidation;

namespace KEGEstation.Presentation.Endpoints.Features.Kim;


public class RegisterEndpoint(
    IUserRepository userRepository,
    IKimRepository kimRepository
) : Endpoint<GetKimRequest, GetKimResponse>
{
    public override void Configure()
    {
        Post("/get");
        Group<KimGroup>();
        AllowAnonymous();
        
        Description(b => b
            .WithName("Get")
            .WithTags(RouteGroups.Kim)
            .Produces<GetKimResponse>());
    }
    
    internal sealed class Validator : Validator<GetKimRequest>
    {
        public Validator()
        {
            RuleFor(x => x.Name)
                .MaximumLength(256).WithMessage("Слишком длинное имя");
            
            RuleFor(x => x.FirstName)
                .MaximumLength(256).WithMessage("Слишком длинная фамилия");
        }
    }

    public override async Task HandleAsync(GetKimRequest req, CancellationToken ct)
    {
        var user = new User{ UserFirstName = req.FirstName, UserName = req.Name, Contacts = req.Contacts };
        await userRepository.CreateAsync(user, ct);
        
        var kim = await kimRepository.GetByIdWithTasksAsync(req.KimId, ct);
        if (kim == null)
        {
            AddError("КИМ не существует.");
            await Send.NotFoundAsync(ct);
            return;
        }
        await Send.OkAsync(new GetKimResponse(Kim: kim), ct);
    }
}

public sealed record GetKimRequest(
    long KimId,
    string Name,
    string FirstName,
    JsonElement? Contacts
);

public sealed record GetKimResponse(
    Domain.Kim Kim
);