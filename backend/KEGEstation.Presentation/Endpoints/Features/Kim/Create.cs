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
    IKimTaskRepository kimTaskRepository,
    IKimRepository kimRepository,
    IAmazonS3 s3Client
) : Endpoint<CreateKimRequest>
{
    public override void Configure()
    {
        Post("/create");
        Group<KimGroup>();
        AllowFileUploads();
        
        Description(b => b
            .WithName("Create")
            .WithTags(RouteGroups.Kim));
    }

    public override async Task HandleAsync(CreateKimRequest req, CancellationToken ct)
    {
        var (userId, role) = User.GetIdAndRole();
        var kim = new Domain.Kim{ CreatorId = userId, Description = req.Description };
        kim = await kimRepository.CreateAsync(kim, ct);

        foreach (var task in req.Tasks)
        {

            var kimTask = new KimTask
            {
                KimId = kim.Id,
                Description = task.Description,
                Number = task.Number,
                Answer = task.Answer,
                AnswerColumnsSize = task.AnswerColumnsSize,
                AnswerRowsSize = task.AnswerRowsSize,
                ImageS3Keys = [],
                FileS3Keys = []
            };

            foreach (var image in task.Images)
            {
                await using var stream = image.OpenReadStream();

                var s3Key = $"image-{kim.Id}-{image.FileName}";
                var putRequest = new PutObjectRequest
                {
                    Key = s3Key,
                    InputStream = stream,
                    ContentType = image.ContentType
                };

                await s3Client.PutObjectAsync(putRequest, ct);
                kimTask.ImageS3Keys.Add(s3Key);
            }
            
            
            foreach (var file in task.Files)
            {
                await using var stream = file.OpenReadStream();

                var s3Key = $"file-{kim.Id}-{file.FileName}";
                var putRequest = new PutObjectRequest
                {
                    Key = s3Key,
                    InputStream = stream,
                    ContentType = file.ContentType
                };

                await s3Client.PutObjectAsync(putRequest, ct);
                kimTask.ImageS3Keys.Add(s3Key);
            }
        }
        
        await Send.NoContentAsync(ct);
    }
}

public sealed record TaskDTO(
    string Description,
    short Number,
    JsonElement Answer,
    short AnswerColumnsSize,
    short AnswerRowsSize,
    IFormFileCollection Images,
    IFormFileCollection Files
);

public sealed record CreateKimRequest(
    string Description,
    List<TaskDTO> Tasks
);