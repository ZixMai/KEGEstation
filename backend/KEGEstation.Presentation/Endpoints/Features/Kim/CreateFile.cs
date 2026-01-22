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


public class CreateFileEndpoint(
    IAmazonS3 s3Client
) : Endpoint<CreateFileRequest>
{
    public override void Configure()
    {
        Post("/createFile");
        Group<KimGroup>();
        AllowFileUploads();
        
        Description(b => b
            .WithName("CreateFile")
            .WithTags(RouteGroups.Kim));
    }

    public override async Task HandleAsync(CreateFileRequest req, CancellationToken ct)
    {
        await using var stream = req.File.OpenReadStream();
        var putRequest = new PutObjectRequest
        {
            BucketName = "files",
            Key = req.S3Key,
            InputStream = stream,
            ContentType = req.File.ContentType
        };
    
        await s3Client.PutObjectAsync(putRequest, ct);
    
        await Send.NoContentAsync(ct);
    }
}

public sealed record CreateFileRequest(
    string S3Key,
    IFormFile File
);