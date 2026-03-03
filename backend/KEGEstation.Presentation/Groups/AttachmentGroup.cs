using FastEndpoints;

namespace KEGEstation.Presentation.Groups;

public sealed class AttachmentGroup : Group
{
    public AttachmentGroup()
    {
        Configure(RouteGroups.Attachments.ToLower(), ep =>
        {
            ep.Description(x => x.WithTags(RouteGroups.Attachments));
        });
    }
}