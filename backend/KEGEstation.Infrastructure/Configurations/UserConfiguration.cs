using KEGEstation.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KEGEstation.Infrastructure.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id)
            .HasColumnName("id")
            .UseIdentityAlwaysColumn();

        builder.Property(u => u.Login)
            .HasColumnName("login")
            .HasColumnType("text");

        builder.Property(u => u.LastName)
            .HasColumnName("last_name")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(u => u.Name)
            .HasColumnName("name")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(u => u.Patronymic)
            .HasColumnName("patronymic")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(u => u.School)
            .HasColumnName("school")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(u => u.SchoolClassName)
            .HasColumnName("school_class_name")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(u => u.Locality)
            .HasColumnName("locality")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(u => u.Role)
            .HasColumnName("role")
            .HasColumnType("text")
            .HasDefaultValue("STUDENT")
            .IsRequired();

        builder.Property(u => u.IsDeleted)
            .HasColumnName("is_deleted")
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .HasMaxLength(200);

        builder.Property(u => u.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("now()")
            .IsRequired();

        builder.Property(u => u.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("now()")
            .IsRequired();

        builder.HasIndex(u => u.Login)
            .IsUnique();
    }
}
