using Api.Features.Users;

namespace Api.Features.Auth;

// Registro público: só name/email/password. Role e Active ficam nos defaults —
// só um usuário autenticado via feature users pode alterar isso depois.
public sealed record RegisterRequest(string Name, string Email, string Password);

public sealed record LoginRequest(string Email, string Password);

// Mesmo contrato { token, user } usado nas skills de front e nas skills Nest/Express.
public sealed record AuthResponse(string Token, UserResponse User);
