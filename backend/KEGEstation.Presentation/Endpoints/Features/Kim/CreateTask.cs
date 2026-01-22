using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints;
using KEGEstation.Domain.Utils;

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
            Description = req.Description,
            Number = req.Number,
            Answer = req.Answer,
            AnswerColumnsSize = req.AnswerColumnsSize,
            AnswerRowsSize = req.AnswerRowsSize,
            ImageS3Keys = req.ImageS3Keys ?? [],
            FileS3Keys = []
        };
        
        foreach (var file in req.Files ?? [])
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream, ct);
            memoryStream.Position = 0;
            
            var s3Key = Guid.NewGuid() + file.FileName;
            var putRequest = new PutObjectRequest
            {
                Key = s3Key,
                BucketName = "files",
                InputStream = memoryStream,
                ContentType = file.ContentType
            };
    
            kimTask.FileS3Keys.Add(s3Key);
            await s3Client.PutObjectAsync(putRequest, ct);
        }
        kimTask = await kimTaskRepository.CreateAsync(kimTask, ct);
        
        await Send.OkAsync(new CreateTaskResponse(TaskId: kimTask.Id), ct);
    }
}


public sealed record CreateTaskRequest(
    string Description,
    short Number,
    string Answer,
    short AnswerColumnsSize,
    short AnswerRowsSize,
    List<string>? ImageS3Keys,
    List<IFormFile>? Files
);

public sealed record CreateTaskResponse(
    long TaskId
);