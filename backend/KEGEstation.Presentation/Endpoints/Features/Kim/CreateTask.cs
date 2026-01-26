using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints;
using KEGEstation.Domain.Utils;
using File = KEGEstation.Domain.File;

namespace KEGEstation.Presentation.Endpoints.Features.Kim;


public class CreateTaskEndpoint(
    IKimTaskRepository kimTaskRepository,
    IAmazonS3 s3Client
) : Endpoint<CreateTaskRequest, CreateTaskResponse>
{
    public override void Configure()
    {
        Post("/createTask");
        Group<KimGroup>();
        AllowFileUploads();
        
        Description(b => b
            .WithName("CreateTask")
            .WithTags(RouteGroups.Kim));
    }

    public override async Task HandleAsync(CreateTaskRequest req, CancellationToken ct)
    {
        var (userId, _) = User.GetIdAndRole();

        var kimTask = new KimTask
        {
            CreatorId = userId,
            Text = req.Text,
            Number = req.Number,
            Key = req.Key,
            AnswerColumnsSize = req.AnswerColumnsSize,
            AnswerRowsSize = req.AnswerRowsSize,
            ImageS3Keys = JsonConverter.MapCollectionToJson(req.ImageS3Keys)
        };

        var fileS3Keys = new List<File>();
        foreach (var file in req.Files ?? [])
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
    
            fileS3Keys.Add(new File{Url = s3Key, Name = file.FileName});
            await s3Client.PutObjectAsync(putRequest, ct);
        }

        kimTask.FileS3Keys = JsonConverter.MapCollectionToJson(fileS3Keys);
        kimTask = await kimTaskRepository.CreateAsync(kimTask, ct);
        
        await Send.OkAsync(new CreateTaskResponse(TaskId: kimTask.Id), ct);
    }
}


public sealed record CreateTaskRequest(
    string Text,
    short Number,
    string Key,
    short AnswerColumnsSize,
    short AnswerRowsSize,
    List<File>? ImageS3Keys,
    List<IFormFile>? Files
);

public sealed record CreateTaskResponse(
    long TaskId
);