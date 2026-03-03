using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints;
using FluentValidation;
using KEGEstation.Domain.Utils;

namespace KEGEstation.Presentation.Endpoints.Features.Kim;


public class CreateEndpoint(
    IKimRepository kimRepository
) : Endpoint<CreateKimRequest>
{
    public override void Configure()
    {
        Post("/create");
        Group<KimGroup>();
        
        Description(b => b.WithName("CreateKim"));
    }

    public override async Task HandleAsync(CreateKimRequest req, CancellationToken ct)
    {
        var (userId, _) = User.GetIdAndRole();
        var kim = new Domain.Kim
        {
            Name = req.Name,
            RealMode = req.RealMode,
            UnlockCode = req.UnlockCode,
            CreatorId = userId,
            Description = req.Description
        };
        kim = await kimRepository.CreateAsync(kim, ct);
        var kimToTasks = req.Tasks.Select(taskId => 
            new KimToTask { KimId = kim.Id, TaskId = taskId }).ToList();
        await kimRepository.LinkTasksToKimAsync(kimToTasks, ct);
        
        await Send.NoContentAsync(ct);
    }
}

public sealed record CreateKimRequest(
    string Name,
    string Description,
    string UnlockCode,
    bool RealMode,
    List<long> Tasks
);