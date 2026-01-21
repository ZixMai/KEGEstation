using FastEndpoints;

namespace KEGEstation.Presentation.Groups;

public sealed class AuthGroup : Group
{
    public AuthGroup()
    {
        Configure(RouteGroups.Auth.ToLower(), ep =>
        {
            ep.Description(x => x.WithTags(RouteGroups.Auth));
        });
    }
}