using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints;
using FluentValidation;

namespace KEGEstation.Presentation.Endpoints.Features.Kim;


public class GetFileEndpoint(
    IAmazonS3 s3Client
) : Endpoint<GetFileRequest>
{
    public override void Configure()
    {
        Post("/getFile");
        Group<KimGroup>();
        AllowAnonymous();

        Description(b => b
            .WithName("GetFile")
            .WithTags(RouteGroups.Kim));
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

public sealed record GetFileRequest(
    string S3Key
);