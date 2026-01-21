using KEGEstation.Domain;

namespace KEGEstation.Application.Abstractions;

public interface IKimRepository
{
    Task<Kim?> GetByIdAsync(long id, CancellationToken ct = default);
    Task<Kim?> GetByIdWithTasksAsync(long id, CancellationToken ct = default);
    Task<List<Kim>> GetAllAsync(CancellationToken ct = default);
    Task<List<Kim>> GetByCreatorIdAsync(long creatorId, CancellationToken ct = default);
    Task<Kim> CreateAsync(Kim kim, CancellationToken ct = default);
    Task<Kim> UpdateAsync(Kim kim, CancellationToken ct = default);
    Task DeleteAsync(long id, CancellationToken ct = default);
}
