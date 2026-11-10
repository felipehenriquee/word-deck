using Api.Common.Services;
using Api.Database;
using Microsoft.EntityFrameworkCore;
using BCryptHasher = BCrypt.Net.BCrypt;

namespace Api.Features.Users;

// UsersService herda todo o CRUD genérico de BaseService<User> e adiciona
// overloads que recebem os DTOs, convertendo-os em entidade e fazendo o hash da
// senha. O AuthService delega a criação de usuários para cá — nunca duplique a
// lógica de hashing em outro lugar (hash duplo quebra o login).
public sealed class UsersService(AppDbContext db) : BaseService<User>(db)
{
    public Task<User?> FindByEmailAsync(string email, CancellationToken ct = default) =>
        Set.FirstOrDefaultAsync(user => user.Email == email, ct);

    public Task<User> CreateAsync(CreateUserRequest request, CancellationToken ct = default) =>
        CreateAsync(new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCryptHasher.HashPassword(request.Password),
            Role = request.Role ?? Roles.Viewer,
            Active = request.Active ?? true,
        }, ct);

    public Task<User> UpdateAsync(Guid id, UpdateUserRequest request, CancellationToken ct = default) =>
        UpdateAsync(id, user =>
        {
            if (request.Name is not null) user.Name = request.Name;
            if (request.Email is not null) user.Email = request.Email;
            if (request.Password is not null) user.PasswordHash = BCryptHasher.HashPassword(request.Password);
            if (request.Role is not null) user.Role = request.Role;
            if (request.Active is not null) user.Active = request.Active.Value;
        }, ct);
}
