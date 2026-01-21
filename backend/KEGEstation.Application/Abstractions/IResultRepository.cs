using KEGEstation.Domain;

namespace KEGEstation.Application.Abstractions;

public interface IResultRepository
{
    Task<Result?> GetByIdAsync(long kimId, long userId, CancellationToken ct = default);
    Task<List<Result>> GetByKimIdAsync(long kimId, CancellationToken ct = default);
    Task<List<Result>> GetByUserIdAsync(long userId, CancellationToken ct = default);
    Task<Result> CreateAsync(Result result, CancellationToken ct = default);
    Task<Result> UpdateAsync(Result result, CancellationToken ct = default);
    Task DeleteAsync(long kimId, long userId, CancellationToken ct = default);
}
