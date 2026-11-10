using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Users;

// Mapeamento EF Core da entidade (equivalente ao "model User" do schema.prisma).
// Descoberto automaticamente pelo AppDbContext (ApplyConfigurationsFromAssembly);
// as colunas viram snake_case por convenção (PasswordHash -> password_hash).
public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(user => user.Id);
        builder.Property(user => user.Name).HasMaxLength(120).IsRequired();
        builder.Property(user => user.Email).HasMaxLength(255).IsRequired();
        builder.HasIndex(user => user.Email).IsUnique();
        builder.Property(user => user.PasswordHash).HasMaxLength(255).IsRequired();
        builder.Property(user => user.Role).HasMaxLength(20).IsRequired();
    }
}
