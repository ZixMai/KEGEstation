using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using FastEndpoints;
using FluentValidation;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;

namespace KEGEstation.Presentation.Endpoints.Features.Kim;

public class GetAllEndpoint(
    IKimRepository kimRepository,
    IAmazonS3 s3Client
) : EndpointWithoutRequest<GetAllKimResponse>
{
    public override void Configure()
    {
        Post("/getAll");
        Group<KimGroup>();
        AllowAnonymous();
        
        Description(b => b
            .WithName("GetAll")
            .WithTags(RouteGroups.Kim)
            .Produces<GetAllKimResponse>());
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var kims = await kimRepository.GetAllAsync(ct);
        
        await Send.OkAsync(
            new GetAllKimResponse(
                Kims: kims.Select(kim =>
                    new GetAllKimResponseUnit(
                        Id: kim.Id,
                        CreatorId: kim.CreatorId,
                        Creator: $"{kim.Creator.LastName} {kim.Creator.Name} ({kim.Creator.Login})",
                        Name: kim.Name,
                        Description: kim.Description,
                        CreatedAt: kim.CreatedAt)
                    ).OrderByDescending(k => k.CreatedAt).ToList()), 
            ct);
    }
}

public sealed record GetAllKimResponseUnit(
    long Id,
    long CreatorId,
    string Creator,
    string Name,
    string? Description,
    DateTime CreatedAt
);

public sealed record GetAllKimResponse(List<GetAllKimResponseUnit> Kims);