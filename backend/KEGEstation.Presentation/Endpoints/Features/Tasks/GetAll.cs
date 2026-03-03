using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using FastEndpoints;
using FluentValidation;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Domain.Utils;
using KEGEstation.Presentation.Endpoints.Features.Kim;
using KEGEstation.Presentation.Groups;
using File = KEGEstation.Domain.File;

namespace KEGEstation.Presentation.Endpoints.Features.Tasks;

public class GetAllEndpoint(
    IKimTaskRepository kimTaskRepository
) : EndpointWithoutRequest<List<GetAllKimTasksResponse>>
{
    public override void Configure()
    {
        Get("/getAllTasks");
        Group<TaskGroup>();

        Description(b => b
            .WithName("GetAllTasks")
            .Produces<List<GetAllKimTasksResponse>>());
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var tasks = await kimTaskRepository.GetAllAsync(ct);

        await Send.OkAsync(
            tasks.Select(task => new GetAllKimTasksResponse(
                Id: task.Id,
                CreatorId: task.CreatorId,
                Number: task.Number,
                Key: task.Key,
                Table: task is { AnswerRowsSize: 1, AnswerColumnsSize: 1 }
                    ? null
                    : new Table(Rows: task.AnswerRowsSize, Columns: task.AnswerColumnsSize),
                Text: task.Text,
                EditorJson: task.EditorJson,
                FileS3Keys: JsonConverter.MapJsonToCollection<File>(task.FileS3Keys)
            )).OrderByDescending(t => t.Id).ToList(), ct);
    }
}

public sealed record GetAllKimTasksResponse(
    long Id,
    long CreatorId,
    short? Number,
    string Key,
    Table? Table,
    string Text,
    string EditorJson,
    List<File> FileS3Keys
);