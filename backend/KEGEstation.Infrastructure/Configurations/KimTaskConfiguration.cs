using KEGEstation.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KEGEstation.Infrastructure.Configurations;

public class KimTaskConfiguration : IEntityTypeConfiguration<KimTask>
{
    public void Configure(EntityTypeBuilder<KimTask> builder)
    {
        builder.ToTable("kim_tasks");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .HasColumnName("id")
            .UseIdentityAlwaysColumn();

        builder.Property(t => t.CreatorId)
            .HasColumnName("creator_id")
            .IsRequired();

        builder.Property(t => t.Text)
            .HasColumnName("text")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(t => t.ImageS3Keys)
            .HasColumnName("image_s3_keys")
            .HasColumnType("jsonb")
            .HasDefaultValueSql("'[]'::jsonb")
            .IsRequired();

        builder.Property(t => t.FileS3Keys)
            .HasColumnName("file_s3_keys")
            .HasColumnType("jsonb")
            .HasDefaultValueSql("'[]'::jsonb")
            .IsRequired();

        builder.Property(t => t.Number)
            .HasColumnName("number")
            .HasColumnType("smallint");

        builder.Property(t => t.Key)
            .HasColumnName("key")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(t => t.AnswerColumnsSize)
            .HasColumnName("answer_columns_size")
            .HasColumnType("smallint")
            .HasDefaultValue((short)1)
            .IsRequired();

        builder.Property(t => t.AnswerRowsSize)
            .HasColumnName("answer_rows_size")
            .HasColumnType("smallint")
            .HasDefaultValue((short)1)
            .IsRequired();

        // Index on FK
        builder.HasIndex(t => t.CreatorId)
            .HasDatabaseName("ix_kim_tasks_creator_id");

        // Relationships
        builder.HasOne(t => t.Creator)
            .WithMany(u => u.CreatedTasks)
            .HasForeignKey(t => t.CreatorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(t => t.KimsForTask)
            .WithOne(x => x.Task)
            .HasForeignKey(x => x.TaskId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
