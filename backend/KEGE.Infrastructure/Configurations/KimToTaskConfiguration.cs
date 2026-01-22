using KEGEstation.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class KimToTaskConfiguration : IEntityTypeConfiguration<KimToTask>
{
    public void Configure(EntityTypeBuilder<KimToTask> builder)
    {
        builder.ToTable("kim_to_tasks");

        builder.HasKey(x => new { x.KimId, x.TaskId });

        builder.Property(x => x.KimId)
            .HasColumnName("kim_id")
            .IsRequired();

        builder.Property(x => x.TaskId)
            .HasColumnName("kim_task_id")
            .IsRequired();

        builder.HasOne(x => x.Kim)
            .WithMany(k => k.TasksForKim)
            .HasForeignKey(x => x.KimId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Task)
            .WithMany(t => t.KimsForTask)
            .HasForeignKey(x => x.TaskId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}