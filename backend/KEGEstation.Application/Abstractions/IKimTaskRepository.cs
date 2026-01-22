using KEGEstation.Domain;

namespace KEGEstation.Application.Abstractions;

public interface IKimTaskRepository
{
    Task<KimTask?> GetByIdAsync(long id, CancellationToken ct = default);
    Task<KimTask> CreateAsync(KimTask task, CancellationToken ct = default);
    Task<KimTask> UpdateAsync(KimTask task, CancellationToken ct = default);
    Task DeleteAsync(long id, CancellationToken ct = default);
}
