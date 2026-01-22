using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints;
using FluentValidation;

namespace KEGEstation.Presentation.Endpoints.Features.Kim;


public class GetEndpoint(
    IUserRepository userRepository,
    IKimRepository kimRepository,
    IAmazonS3 s3Client
) : Endpoint<GetKimRequest, GetKimResponse>
{
    public override void Configure()
    {
        Post("/get");
        Group<KimGroup>();
        AllowAnonymous();
        
        Description(b => b
            .WithName("Get")
            .WithTags(RouteGroups.Kim)
            .Produces<GetKimResponse>());
    }
    
    internal sealed class Validator : Validator<GetKimRequest>
    {
        public Validator()
        {
            RuleFor(x => x.Name)
                .MaximumLength(256).WithMessage("Слишком длинное имя");
            
            RuleFor(x => x.FirstName)
                .MaximumLength(256).WithMessage("Слишком длинная фамилия");
        }
    }

    public override async Task HandleAsync(GetKimRequest req, CancellationToken ct)
    {
        var user = new User{ UserFirstName = req.FirstName, UserName = req.Name, Contacts = req.Contacts };
        user = await userRepository.CreateAsync(user, ct);
        
        var kim = await kimRepository.GetByIdWithTasksAsync(req.KimId, ct);
        if (kim == null)
        {
            AddError("КИМ не существует.");
            await Send.NotFoundAsync(ct);
            return;
        }

        var images = new List<string>();
        // foreach (var key in kim.TasksForKim.SelectMany(task => task.Task.ImageS3Keys).ToList())
        // {
        //     var response = await s3Client.GetObjectAsync(new GetObjectRequest
        //     {
        //         BucketName = "files",
        //         Key = key
        //     }, ct);
        //     
        //     using var memoryStream = new MemoryStream();
        //     await response.ResponseStream.CopyToAsync(memoryStream, ct);
        //     images.Add(Convert.ToBase64String(memoryStream.ToArray()));
        // }

        
        await Send.OkAsync(
            new GetKimResponse(
                Id: kim.Id,
                CreatorId: kim.CreatorId,
                Description: kim.Description,
                CreatedAt: kim.CreatedAt,
                UpdatedAt: kim.UpdatedAt,
                UnlockCode: kim.UnlockCode,
                TasksForKim: kim.TasksForKim.Select(task => task.Task).ToList(),
                User: user, 
                Base64Images: images),
        ct);
    }
}

public sealed record GetKimRequest(
    long KimId,
    string Name,
    string FirstName,
    JsonElement? Contacts
);

public sealed record GetKimResponse(
    long Id,
    long CreatorId,
    string? Description,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string UnlockCode,
    List<KimTask> TasksForKim,
    User User,
    List<string> Base64Images
);