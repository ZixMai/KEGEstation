using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using Microsoft.EntityFrameworkCore;

namespace KEGEstation.Infrastructure.Repositories;

public class KimTaskRepository(DbContext context) : IKimTaskRepository
{
    public async Task<KimTask?> GetByIdAsync(long id, CancellationToken ct = default)
    {
        return await context.KimTasks.FirstOrDefaultAsync(t => t.Id == id, ct);
    }

    public async Task<KimTask> CreateAsync(KimTask task, CancellationToken ct = default)
    {
        context.KimTasks.Add(task);
        await context.SaveChangesAsync(ct);
        return task;
    }

    public async Task<KimTask> UpdateAsync(KimTask task, CancellationToken ct = default)
    {
        context.KimTasks.Update(task);
        await context.SaveChangesAsync(ct);
        return task;
    }

    public async Task DeleteAsync(long id, CancellationToken ct = default)
    {
        var task = await GetByIdAsync(id, ct);
        if (task != null)
        {
            context.KimTasks.Remove(task);
            await context.SaveChangesAsync(ct);
        }
    }
}
