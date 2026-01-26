using KEGEstation.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KEGEstation.Infrastructure.Configurations;

public class KimConfiguration : IEntityTypeConfiguration<Kim>
{
    public void Configure(EntityTypeBuilder<Kim> builder)
    {
        builder.ToTable("kims");

        builder.HasKey(k => k.Id);

        builder.Property(k => k.Id)
            .HasColumnName("id")
            .UseIdentityAlwaysColumn();

        builder.Property(k => k.CreatorId)
            .HasColumnName("creator_id")
            .IsRequired();

        builder.Property(k => k.Name)
            .HasColumnName("name")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(k => k.Description)
            .HasColumnName("description")
            .HasColumnType("text");

        builder.Property(k => k.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("now()")
            .IsRequired();

        builder.Property(k => k.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("now()")
            .IsRequired();

        builder.Property(k => k.RealMode)
            .HasColumnName("real_mode")
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(k => k.UnlockCode)
            .HasColumnName("unlock_code")
            .HasColumnType("text")
            .IsRequired();

        // Index on FK
        builder.HasIndex(k => k.CreatorId)
            .HasDatabaseName("ix_kims_creator_id");

        // Relationships
        builder.HasOne(k => k.Creator)
            .WithMany(u => u.CreatedKims)
            .HasForeignKey(k => k.CreatorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(k => k.Results)
            .WithOne(r => r.Kim)
            .HasForeignKey(r => r.KimId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(k => k.TasksForKim)
            .WithOne(x => x.Kim)
            .HasForeignKey(x => x.KimId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
