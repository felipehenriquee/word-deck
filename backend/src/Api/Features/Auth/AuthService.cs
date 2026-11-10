using Api.Common.Errors;
using Api.Features.Users;
using BCryptHasher = BCrypt.Net.BCrypt;

namespace Api.Features.Auth;

// Service próprio (não é CRUD, por isso NÃO estende BaseService).
public sealed class AuthService(UsersService users, JwtTokenService tokens)
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        if (await users.FindByEmailAsync(request.Email, ct) is not null)
        {
            throw new ConflictException("Já existe um usuário com este email");
        }

        // O hash da senha acontece dentro de UsersService.CreateAsync. NÃO hashear
        // aqui de novo — isso já foi um bug real na skill Nest (hash duplo, login
        // nunca batia).
        var user = await users.CreateAsync(new CreateUserRequest(request.Name, request.Email, request.Password, null, null), ct);

        return new AuthResponse(tokens.CreateToken(user), user.ToResponse());
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await users.FindByEmailAsync(request.Email, ct);
        if (user is null || !BCryptHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedException("Email ou senha inválidos");
        }

        if (!user.Active)
        {
            throw new UnauthorizedException("Usuário inativo");
        }

        return new AuthResponse(tokens.CreateToken(user), user.ToResponse());
    }

    public async Task<UserResponse> MeAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await users.GetByIdAsync(userId, ct);
        return user.ToResponse();
    }
}
