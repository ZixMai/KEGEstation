using FastEndpoints;

namespace KEGEstation.Presentation.Groups;

public sealed class KimGroup : Group
{
    public KimGroup()
    {
        Configure(RouteGroups.Kim.ToLower(), ep =>
        {
            ep.Description(x => x.WithTags(RouteGroups.Kim));
        });
    }
}