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

public class UpdateEndpoint(
    IKimTaskRepository kimTaskRepository,
    IAmazonS3 s3Client
) : Endpoint<UpdateTaskRequest>
{
    public override void Configure()
    {
        Put("/updateTask");
        Group<TaskGroup>();
        AllowFileUploads();

        Description(b => b.WithName("UpdateTask"));
    }

    public override async Task HandleAsync(UpdateTaskRequest req, CancellationToken ct)
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

        foreach (var file in req.NewFiles ?? [])
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream, ct);
            memoryStream.Position = 0;
            
            var s3Key = Guid.NewGuid().ToString();
            var putRequest = new PutObjectRequest
            {
                Key = s3Key,
                BucketName = "files",
                InputStream = memoryStream,
                ContentType = file.ContentType
            };
    
            req.FileS3Keys.Add(new File{Url = s3Key, Name = file.FileName});
            await s3Client.PutObjectAsync(putRequest, ct);
        }
        
        kimTask.Text = req.Text;
        kimTask.EditorJson = req.EditorJson;
        kimTask.AnswerRowsSize = req.AnswerRowsSize;
        kimTask.AnswerColumnsSize = req.AnswerColumnsSize;
        kimTask.Number = req.Number;
        kimTask.FileS3Keys = JsonConverter.MapCollectionToJson(req.FileS3Keys);
        kimTask.Key = req.Key;
        
        await kimTaskRepository.UpdateAsync(kimTask, ct);
        
        await Send.NoContentAsync(ct);
    }
}

public sealed record UpdateTaskRequest( 
    long TaskId,
    short Number,
    string Key,
    string Text,
    string EditorJson,
    short AnswerColumnsSize,
    short AnswerRowsSize,
    List<File> FileS3Keys,
    List<IFormFile>? NewFiles
);