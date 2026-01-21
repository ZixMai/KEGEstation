using KEGEstation.Application.Abstractions;
using KEGEstation.Domain;
using Microsoft.EntityFrameworkCore;

namespace KEGEstation.Infrastructure.Repositories;

public class UserRepository(DbContext context) : IUserRepository
{
    public async Task<User?> GetByIdAsync(long id, CancellationToken ct = default)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted, ct);
    }

    public async Task<User?> GetByLoginAsync(string login, CancellationToken ct = default)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Login == login && !u.IsDeleted, ct);
    }

    public async Task<List<User>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.Users.Where(u => !u.IsDeleted).ToListAsync(ct);
    }

    public async Task<User> CreateAsync(User user, CancellationToken ct = default)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync(ct);
        return user;
    }

    public async Task<User> UpdateAsync(User user, CancellationToken ct = default)
    {
        user.UpdatedAt = DateTime.UtcNow;
        context.Users.Update(user);
        await context.SaveChangesAsync(ct);
        return user;
    }

    public async Task DeleteAsync(long id, CancellationToken ct = default)
    {
        var user = await GetByIdAsync(id, ct);
        if (user != null)
        {
            user.IsDeleted = true;
            user.UpdatedAt = DateTime.UtcNow;
            await context.SaveChangesAsync(ct);
        }
    }
}
