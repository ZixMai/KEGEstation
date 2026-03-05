using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints;
using KEGEstation.Domain.Utils;
using File = KEGEstation.Domain.File;

namespace KEGEstation.Presentation.Endpoints.Features.Tasks;

public class DeleteTaskEndpoint(
    IKimTaskRepository kimTaskRepository,
    IAmazonS3 s3Client
) : Endpoint<DeleteTaskRequest>
{
    public override void Configure()
    {
        Delete("/deleteTask");
        Group<TaskGroup>();

        Description(b => b.WithName("DeleteTask"));
    }

    public override async Task HandleAsync(DeleteTaskRequest req, CancellationToken ct)
    {
        var (userId, role) = User.GetIdAndRole();

        var kimTask = await kimTaskRepository.GetByIdAsync(req.TaskId, ct);
        if (kimTask == null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        if (role != Role.ADMIN && (kimTask.CreatorId != userId || role == Role.STUDENT || role == Role.TEACHER))
        {
            await Send.ForbiddenAsync(ct);
            return;
        }

        var fileS3Keys = JsonConverter.MapJsonToCollection<File>(kimTask.FileS3Keys);
        foreach (var deleteRequest in fileS3Keys.Select(file => new DeleteObjectRequest
                 {
                     Key = file.Url,
                     BucketName = "files",
                 }))
        {
            await s3Client.DeleteObjectAsync(deleteRequest, ct);
        }
        await kimTaskRepository.DeleteAsync(kimTask.Id, ct);

        await Send.NoContentAsync(ct);
    }
}

public sealed record DeleteTaskRequest(
    long TaskId
);