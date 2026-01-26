using KEGEstation.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KEGEstation.Infrastructure.Configurations;

public class ResultConfiguration : IEntityTypeConfiguration<Result>
{
    public void Configure(EntityTypeBuilder<Result> builder)
    {
        builder.ToTable("results");

        // Composite primary key
        builder.HasKey(r => new { r.KimId, r.UserId });

        builder.Property(r => r.KimId)
            .HasColumnName("kim_id")
            .IsRequired();

        builder.Property(r => r.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(r => r.ResultValue)
            .HasColumnName("result")
            .HasColumnType("smallint")
            .HasDefaultValue((short)0)
            .IsRequired();

        builder.Property(r => r.Metadata)
            .HasColumnName("metadata")
            .HasColumnType("jsonb");

        builder.Property(r => r.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("now()")
            .IsRequired();

        builder.Property(r => r.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("now()")
            .IsRequired();

        // Indexes on FKs
        builder.HasIndex(r => r.KimId)
            .HasDatabaseName("ix_kim_results_kim_id");

        builder.HasIndex(r => r.UserId)
            .HasDatabaseName("ix_kim_results_user_id");

        // Relationships
        builder.HasOne(r => r.Kim)
            .WithMany(k => k.Results)
            .HasForeignKey(r => r.KimId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.User)
            .WithMany(u => u.Results)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}