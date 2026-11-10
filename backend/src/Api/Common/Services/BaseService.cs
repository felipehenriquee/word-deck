using Api.Common.Entities;
using Api.Common.Errors;
using Api.Common.Pagination;
using Api.Database;
using Microsoft.EntityFrameworkCore;

namespace Api.Common.Services;

// Equivalente ao BaseService das skills Vue/Angular/React/Nest/Express: GetAll
// (paginado), GetById, Create, Update, Delete genéricos sobre um DbSet<TEntity>.
//
// Cada feature service estende esta classe:
//   public sealed class ProductsService(AppDbContext db) : BaseService<Product>(db) { }
//
// Os métodos recebem a ENTIDADE (Create) ou uma função que aplica as mudanças
// (Update). A conversão de DTO -> entidade (e regras como hash de senha) fica no
// service da feature, em overloads que recebem o DTO e chamam estes métodos.
public abstract class BaseService<TEntity>(AppDbContext db) where TEntity : BaseEntity
{
    protected AppDbContext Db { get; } = db;

    protected DbSet<TEntity> Set => Db.Set<TEntity>();

    public virtual async Task<PaginatedResponse<TEntity>> GetAllAsync(PaginationQuery query, CancellationToken ct = default)
    {
        var page = query.Page is > 0 ? query.Page.Value : 1;
        var perPage = Math.Clamp(query.PerPage ?? PaginationQuery.DefaultPerPage, 1, PaginationQuery.MaxPerPage);

        // Sequencial de propósito: um DbContext não suporta operações concorrentes
        // (diferente do Promise.all usado com o Prisma na skill Express).
        var total = await Set.CountAsync(ct);
        var data = await ApplySort(Set.AsNoTracking(), query)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync(ct);

        return PaginatedResponse<TEntity>.Create(data, total, page, perPage);
    }

    public virtual async Task<TEntity> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await Set.FindAsync([id], ct) ?? throw new NotFoundException($"Registro com id \"{id}\" não encontrado");

    public virtual async Task<TEntity> CreateAsync(TEntity entity, CancellationToken ct = default)
    {
        Set.Add(entity);
        await Db.SaveChangesAsync(ct);
        return entity;
    }

    public virtual async Task<TEntity> UpdateAsync(Guid id, Action<TEntity> applyChanges, CancellationToken ct = default)
    {
        var entity = await GetByIdAsync(id, ct); // garante 404 consistente antes do update
        applyChanges(entity);
        await Db.SaveChangesAsync(ct);
        return entity;
    }

    public virtual async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await GetByIdAsync(id, ct);
        Set.Remove(entity);
        await Db.SaveChangesAsync(ct);
    }

    // Ordena pelo campo pedido em ?sort= (case-insensitive, validado contra o
    // modelo do EF para não aceitar nomes arbitrários) ou, por padrão, por
    // CreatedAt — paginação sem ORDER BY devolve páginas inconsistentes.
    private IQueryable<TEntity> ApplySort(IQueryable<TEntity> source, PaginationQuery query)
    {
        var propertyName = string.IsNullOrWhiteSpace(query.Sort) ? nameof(BaseEntity.CreatedAt) : ResolveSortProperty(query.Sort);
        var descending = string.Equals(query.Order, "desc", StringComparison.OrdinalIgnoreCase);

        var ordered = descending
            ? source.OrderByDescending(entity => EF.Property<object>(entity, propertyName))
            : source.OrderBy(entity => EF.Property<object>(entity, propertyName));

        return ordered.ThenBy(entity => entity.Id);
    }

    private string ResolveSortProperty(string sort)
    {
        var property = Db.Model.FindEntityType(typeof(TEntity))?
            .GetProperties()
            .FirstOrDefault(p => string.Equals(p.Name, sort, StringComparison.OrdinalIgnoreCase));

        return property?.Name ?? throw new BadRequestException($"Não é possível ordenar por \"{sort}\"");
    }
}
