using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using Microsoft.EntityFrameworkCore;

namespace KEGEstation.Infrastructure.Repositories;

public class ResultRepository(DbContext context) : IResultRepository
{
    public async Task<Result?> GetByIdAsync(long kimId, long userId, CancellationToken ct = default)
    {
        return await context.Results.FirstOrDefaultAsync(r => r.KimId == kimId && r.UserId == userId, ct);
    }

    public async Task<List<Result>> GetByKimIdAsync(long kimId, CancellationToken ct = default)
    {
        return await context.Results.Where(r => r.KimId == kimId).ToListAsync(ct);
    }

    public async Task<List<Result>> GetByUserIdAsync(long userId, CancellationToken ct = default)
    {
        return await context.Results.Where(r => r.UserId == userId).ToListAsync(ct);
    }

    public async Task<Result> CreateAsync(Result result, CancellationToken ct = default)
    {
        context.Results.Add(result);
        await context.SaveChangesAsync(ct);
        return result;
    }

    public async Task<Result> UpdateAsync(Result result, CancellationToken ct = default)
    {
        result.UpdatedAt = DateTime.UtcNow;
        context.Results.Update(result);
        await context.SaveChangesAsync(ct);
        return result;
    }

    public async Task DeleteAsync(long kimId, long userId, CancellationToken ct = default)
    {
        var result = await GetByIdAsync(kimId, userId, ct);
        if (result != null)
        {
            context.Results.Remove(result);
            await context.SaveChangesAsync(ct);
        }
    }
}
