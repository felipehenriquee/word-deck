namespace Api.Features.Users;

// Equivalente ao toSafeUser() da skill Express: garante que o hash da senha nunca
// vaza numa resposta. Todo endpoint que devolve um User deve passar por aqui.
public static class UserMapper
{
    public static UserResponse ToResponse(this User user) =>
        new(user.Id, user.Name, user.Email, user.Role, user.Active, user.CreatedAt, user.UpdatedAt);
}
