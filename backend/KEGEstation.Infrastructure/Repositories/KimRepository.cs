using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using Microsoft.EntityFrameworkCore;

namespace KEGEstation.Infrastructure.Repositories;

public class KimRepository(DbContext context) : IKimRepository
{
    public async Task<Kim?> GetByIdAsync(long id, CancellationToken ct = default)
    {
        return await context.Kims.FirstOrDefaultAsync(k => k.Id == id, ct);
    }

    public async Task<Kim?> GetByIdWithTasksAsync(long id, CancellationToken ct = default)
    {
        return await context.Kims
            .Include(k => k.TasksForKim)
            .ThenInclude(t => t.Task)
            .Include(k => k.Creator)
            .FirstOrDefaultAsync(k => k.Id == id, ct);
    }

    public async Task<List<Kim>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.Kims.Include(k => k.Creator).ToListAsync(ct);
    }

    public async Task<List<Kim>> GetByCreatorIdAsync(long creatorId, CancellationToken ct = default)
    {
        return await context.Kims.Where(k => k.CreatorId == creatorId).ToListAsync(ct);
    }

    public async Task<Kim> CreateAsync(Kim kim, CancellationToken ct = default)
    {
        context.Kims.Add(kim);
        await context.SaveChangesAsync(ct);
        return kim;
    }

    public async Task LinkTasksToKimAsync(List<KimToTask> kimToTasks, CancellationToken ct = default)
    {
        await context.KimToTasks.AddRangeAsync(kimToTasks, ct);
        await context.SaveChangesAsync(ct);
    }

    public async Task<Kim> UpdateAsync(Kim kim, CancellationToken ct = default)
    {
        kim.UpdatedAt = DateTime.UtcNow;
        context.Kims.Update(kim);
        await context.SaveChangesAsync(ct);
        return kim;
    }

    public async Task DeleteAsync(long id, CancellationToken ct = default)
    {
        var kim = await GetByIdAsync(id, ct);
        if (kim != null)
        {
            context.Kims.Remove(kim);
            await context.SaveChangesAsync(ct);
        }
    }
}
