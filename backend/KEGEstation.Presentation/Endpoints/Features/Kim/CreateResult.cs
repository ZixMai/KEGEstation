using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints;
using FluentValidation;

namespace KEGEstation.Presentation.Endpoints.Features.Kim;


public class CreateResultEndpoint(
    IResultRepository resultRepository
) : Endpoint<CreateResultRequest>
{
    public override void Configure()
    {
        Post("/createResult");
        Group<KimGroup>();
        AllowAnonymous();
        
        Description(b => b
            .WithName("CreateResult")
            .WithTags(RouteGroups.Kim));
    }
    
    internal sealed class Validator : Validator<CreateResultRequest>
    {
        public Validator()
        {
            RuleFor(x => x.Result).LessThanOrEqualTo((short)100).WithMessage("Слишком большой балл");
        }
    }

    public override async Task HandleAsync(CreateResultRequest req, CancellationToken ct)
    {
        var res = new Result{ KimId = req.KimId, UserId = req.UserId, ResultValue = req.Result, Metadata = req.MetaData };
        await resultRepository.CreateAsync(res, ct);
        await Send.NoContentAsync(cancellation: ct);
    }
}

public sealed record CreateResultRequest(
    long KimId,
    long UserId,
    short Result,
    JsonElement? MetaData
);