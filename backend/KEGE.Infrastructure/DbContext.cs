using KEGEstation.Domain;
using Microsoft.EntityFrameworkCore;

namespace KEGEstation.Infrastructure;

public class DbContext : Microsoft.EntityFrameworkCore.DbContext 
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Kim> Kims { get; set; } = null!;
    public DbSet<KimTask> KimTasks { get; set; } = null!;
    public DbSet<KimToTask> KimToTasks { get; set; } = null!;
    public DbSet<Result> Results { get; set; } = null!;
        
    public DbContext(DbContextOptions<DbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DbContext).Assembly);
    }
}
