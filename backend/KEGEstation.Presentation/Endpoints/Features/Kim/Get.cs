using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using KEGEstation.Presentation.Groups;
using FastEndpoints;
using FluentValidation;
using KEGEstation.Domain.Utils;
using File = KEGEstation.Domain.File;

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
            
            RuleFor(x => x.LastName)
                .MaximumLength(256).WithMessage("Слишком длинная фамилия");
            
            RuleFor(x => x.Patronymic)
                .MaximumLength(256).WithMessage("Слишком длинное отчество");
            
            RuleFor(x => x.School)
                .MaximumLength(512).WithMessage("Слишком длинное название школы");
            
            RuleFor(x => x.SchoolClassName)
                .MaximumLength(64).WithMessage("Слишком длинное название класса");

            RuleFor(x => x.Locality)
                .MaximumLength(200).WithMessage("Слишком длинное название населённого пункта");
        }
    }

    public override async Task HandleAsync(GetKimRequest req, CancellationToken ct)
    {
        var user = new User
        { 
            LastName = req.LastName,
            Name = req.Name,
            Patronymic = req.Patronymic,
            School = req.School,
            SchoolClassName = req.SchoolClassName,
            Locality = req.Locality
        };
        user = await userRepository.CreateAsync(user, ct);
        
        var kim = await kimRepository.GetByIdWithTasksAsync(req.KimId, ct);
        if (kim == null)
        {
            AddError("КИМ не существует.");
            await Send.NotFoundAsync(ct);
            return;
        }

        var images = new List<Base64File>();
        // foreach (var file in kim.TasksForKim.SelectMany(task => JsonConverter.MapJsonToCollection<File>(task.Task.ImageS3Keys)).ToList())
        // {
        //     var response = await s3Client.GetObjectAsync(new GetObjectRequest
        //     {
        //         BucketName = "files",
        //         Key = file.Url
        //     }, ct);
        //     
        //     using var memoryStream = new MemoryStream();
        //     await response.ResponseStream.CopyToAsync(memoryStream, ct);
        //     images.Add(new Base64File
        //     {
        //         Base64Content = Convert.ToBase64String(memoryStream.ToArray()),
        //         Name = file.Name
        //     });
        // }

        
        await Send.OkAsync(
            new GetKimResponse(
                Id: kim.Id,
                CreatorId: kim.CreatorId,
                Name: kim.Name,
                Description: kim.Description,
                CreatedAt: kim.CreatedAt,
                UpdatedAt: kim.UpdatedAt,
                UnlockCode: kim.UnlockCode,
                RealMode: kim.RealMode,
                TasksForKim: kim.TasksForKim.Select(taskLink => 
                    new GetKimTaskResponse(
                        Id: taskLink.Task.Id,
                        CreatorId: taskLink.Task.CreatorId,
                        Number: taskLink.Task.Number,
                        Key: taskLink.Task.Key,
                        Table: taskLink.Task is { AnswerRowsSize: 1, AnswerColumnsSize: 1 } 
                            ? null :
                            new Table(Rows: taskLink.Task.AnswerRowsSize, Columns: taskLink.Task.AnswerColumnsSize),
                        Text: taskLink.Task.Text,
                        ImageS3Keys: JsonConverter.MapJsonToCollection<File>(taskLink.Task.ImageS3Keys),
                        FileS3Keys: JsonConverter.MapJsonToCollection<File>(taskLink.Task.FileS3Keys)
                    )).OrderBy(t => t.Number ?? 0).ThenBy(t => t.Id).ToList(),
                UserId: user.Id, 
                Base64Images: images),
        ct);
    }
}

public sealed record GetKimRequest(
    long KimId,
    string Name,
    string LastName,
    string Patronymic,
    string School,
    string SchoolClassName,
    string Locality
);

public sealed record Table(
    short Rows,
    short Columns
);

public sealed record GetKimTaskResponse(
    long Id,
    long CreatorId,
    short? Number,
    string Key,
    Table? Table,
    string Text,
    List<File> ImageS3Keys,
    List<File> FileS3Keys
);


public sealed record GetKimResponse(
    long Id,
    long CreatorId,
    string Name,
    string? Description,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string UnlockCode,
    bool RealMode,
    List<GetKimTaskResponse> TasksForKim,
    long UserId,
    List<Base64File> Base64Images
);