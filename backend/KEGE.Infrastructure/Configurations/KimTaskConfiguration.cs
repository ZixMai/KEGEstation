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

        builder.Property(t => t.KimId)
            .HasColumnName("kim_id")
            .IsRequired();

        builder.Property(t => t.Description)
            .HasColumnName("description")
            .HasColumnType("text");

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

        builder.Property(t => t.Answer)
            .HasColumnName("answer")
            .HasColumnType("jsonb")
            .HasDefaultValueSql("'[]'::jsonb")
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
        builder.HasIndex(t => t.KimId)
            .HasDatabaseName("ix_kim_tasks_kim_id");

        // Relationships
        builder.HasOne(t => t.Kim)
            .WithMany(k => k.Tasks)
            .HasForeignKey(t => t.KimId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
