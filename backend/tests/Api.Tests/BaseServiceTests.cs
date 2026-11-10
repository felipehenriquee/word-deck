using Api.Common.Errors;
using Api.Common.Pagination;
using Api.Common.Services;
using Api.Database;
using Api.Features.Users;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Api.Tests;

// Testa o BaseService contra um SQLite em memória (banco real, porém descartável),
// em vez de mockar o DbContext — mocks de IQueryable/EF costumam mentir sobre o
// comportamento real das queries.
public sealed class BaseServiceTests : IAsyncLifetime
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");
    private AppDbContext _db = null!;

    // Usa o BaseService "puro", sem os overloads/regras do UsersService.
    private sealed class UsersCrudService(AppDbContext db) : BaseService<User>(db);

    public async Task InitializeAsync()
    {
        await _connection.OpenAsync();
        _db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(_connection).Options);
        await _db.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await _db.DisposeAsync();
        await _connection.DisposeAsync();
    }

    private static User NewUser(int index) => new()
    {
        Name = $"User {index:D2}",
        Email = $"user{index}@example.com",
        PasswordHash = "hash",
    };

    [Fact]
    public async Task GetAll_PaginaEDevolveTotalPagesCalculado()
    {
        _db.AddRange(Enumerable.Range(1, 45).Select(NewUser));
        await _db.SaveChangesAsync();
        var service = new UsersCrudService(_db);

        var result = await service.GetAllAsync(new PaginationQuery { Page = 2, PerPage = 20 });

        Assert.Equal(20, result.Data.Count);
        Assert.Equal(45, result.Total);
        Assert.Equal(2, result.Page);
        Assert.Equal(3, result.TotalPages);
    }

    [Fact]
    public async Task GetAll_OrdenaPeloCampoInformado()
    {
        _db.AddRange(NewUser(1), NewUser(2), NewUser(3));
        await _db.SaveChangesAsync();
        var service = new UsersCrudService(_db);

        var result = await service.GetAllAsync(new PaginationQuery { Sort = "name", Order = "desc" });

        Assert.Equal(new[] { "User 03", "User 02", "User 01" }, result.Data.Select(user => user.Name));
    }

    [Fact]
    public async Task GetAll_ComCampoDeOrdenacaoInexistente_LancaBadRequest()
    {
        var service = new UsersCrudService(_db);

        await Assert.ThrowsAsync<BadRequestException>(() => service.GetAllAsync(new PaginationQuery { Sort = "naoExiste" }));
    }

    [Fact]
    public async Task GetById_QuandoNaoEncontra_LancaNotFound()
    {
        var service = new UsersCrudService(_db);

        await Assert.ThrowsAsync<NotFoundException>(() => service.GetByIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task Create_PreencheTimestamps()
    {
        var service = new UsersCrudService(_db);

        var user = await service.CreateAsync(NewUser(1));

        Assert.NotEqual(default, user.CreatedAt);
        Assert.Equal(user.CreatedAt, user.UpdatedAt);
    }

    [Fact]
    public async Task Update_AplicaMudancasEAtualizaUpdatedAt()
    {
        var service = new UsersCrudService(_db);
        var created = await service.CreateAsync(NewUser(1));
        var createdAt = created.CreatedAt;

        var updated = await service.UpdateAsync(created.Id, user => user.Name = "Renomeado");

        Assert.Equal("Renomeado", updated.Name);
        Assert.True(updated.UpdatedAt >= createdAt);
    }

    [Fact]
    public async Task Update_QuandoNaoEncontra_LancaNotFound()
    {
        var service = new UsersCrudService(_db);

        await Assert.ThrowsAsync<NotFoundException>(() => service.UpdateAsync(Guid.NewGuid(), _ => { }));
    }

    [Fact]
    public async Task Delete_RemoveORegistro()
    {
        var service = new UsersCrudService(_db);
        var created = await service.CreateAsync(NewUser(1));

        await service.DeleteAsync(created.Id);

        Assert.False(await _db.Set<User>().AnyAsync(user => user.Id == created.Id));
    }
}
