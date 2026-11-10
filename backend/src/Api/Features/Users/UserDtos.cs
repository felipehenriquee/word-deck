namespace Api.Features.Users;

// Equivalente aos schemas Zod (create/update) da skill Express. A validação fica
// em UserValidators.cs. Campos ausentes no JSON chegam como null.
public sealed record CreateUserRequest(string Name, string Email, string Password, string? Role, bool? Active);

// PATCH parcial: só os campos não-nulos são aplicados.
public sealed record UpdateUserRequest(string? Name, string? Email, string? Password, string? Role, bool? Active);

// Resposta pública de um User — nunca inclui o hash da senha.
public sealed record UserResponse(
    Guid Id,
    string Name,
    string Email,
    string Role,
    bool Active,
    DateTime CreatedAt,
    DateTime UpdatedAt);
