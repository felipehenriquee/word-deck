using System.Text.RegularExpressions;
using Api.Common.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Api.Database;

// DbContext único da aplicação. Não declara DbSet<T> por feature: cada feature
// registra a própria entidade com um IEntityTypeConfiguration<T> (ex:
// Features/Users/UserConfiguration.cs), descoberto automaticamente pelo
// ApplyConfigurationsFromAssembly — e os services acessam via Set<T>().
// Assim, criar uma feature nova não exige mexer neste arquivo.
public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    private static readonly Regex WordBoundary = new("([a-z0-9])([A-Z])", RegexOptions.Compiled);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        ApplySnakeCaseColumnNames(modelBuilder);
    }

    // O MySQL (datetime) não guarda fuso: sem isto, as datas voltam do banco com
    // DateTimeKind.Unspecified e são serializadas sem o "Z" — o frontend as leria como
    // horário local. Toda data da aplicação é gravada em UTC (ver TouchTimestamps).
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<DateTime>().HaveConversion<UtcDateTimeConverter>();
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        TouchTimestamps();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
    {
        TouchTimestamps();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    // Equivalente ao @default(now()) / @updatedAt do Prisma.
    private void TouchTimestamps()
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }
    }

    // Colunas em snake_case (CreatedAt -> created_at) para todas as entidades, sem
    // precisar de HasColumnName em cada propriedade. Um HasColumnName explícito na
    // configuração da feature continua tendo prioridade.
    private static void ApplySnakeCaseColumnNames(ModelBuilder modelBuilder)
    {
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entity.GetProperties())
            {
                if (property.GetColumnName() == property.Name)
                {
                    property.SetColumnName(WordBoundary.Replace(property.Name, "$1_$2").ToLowerInvariant());
                }
            }
        }
    }
}

internal sealed class UtcDateTimeConverter() : ValueConverter<DateTime, DateTime>(
    value => value.ToUniversalTime(),
    value => DateTime.SpecifyKind(value, DateTimeKind.Utc));
