using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints;
using FluentValidation;

namespace KEGEstation.Presentation.Endpoints.Features.Attachments;


public class GetFileEndpoint(
    IAmazonS3 s3Client
) : Endpoint<GetFileRequest>
{
    public override void Configure()
    {
        Get("/getFile/{S3Key}");
        Group<AttachmentGroup>();
        AllowAnonymous();

        Description(b => b.WithName("GetFile"));
    }

    public override async Task HandleAsync(GetFileRequest req, CancellationToken ct)
    {
        var response = await s3Client.GetObjectAsync(new GetObjectRequest
        {
            Key = req.S3Key,
            BucketName = "files"
        }, ct);

        await Send.StreamAsync(
            stream: response.ResponseStream,
            fileLengthBytes: response.ContentLength,
            contentType: response.Headers.ContentType,
            cancellation: ct
        );
    }
}

public sealed record GetFileRequest(string S3Key);