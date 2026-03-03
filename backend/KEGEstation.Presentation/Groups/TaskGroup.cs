using FastEndpoints;

namespace KEGEstation.Presentation.Groups;

public sealed class TaskGroup : Group
{
    public TaskGroup()
    {
        Configure(RouteGroups.Tasks.ToLower(), ep =>
        {
            ep.Description(x => x.WithTags(RouteGroups.Tasks));
        });
    }
}