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

        builder.Property(u => u.UserFirstName)
            .HasColumnName("user_first_name")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(u => u.UserName)
            .HasColumnName("user_name")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(u => u.Contacts)
            .HasColumnName("contacts")
            .HasColumnType("jsonb")
            .HasDefaultValueSql("'[]'::jsonb")
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
