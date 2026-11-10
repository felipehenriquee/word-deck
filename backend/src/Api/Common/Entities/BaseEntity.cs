namespace Api.Common.Entities;

// Base de toda entidade persistida: id (UUID v7, ordenável por tempo) e timestamps,
// preenchidos automaticamente pelo AppDbContext ao salvar.
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
