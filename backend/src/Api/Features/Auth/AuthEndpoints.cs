using System.Security.Claims;
using Api.Common.Security;
using Api.Common.Validation;
using Api.Features.Users;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Api.Features.Auth;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder api)
    {
        var group = api.MapGroup("/auth").WithTags("Auth");

        group.MapPost("/register", Register).WithValidation<RegisterRequest>();
        group.MapPost("/login", Login).WithValidation<LoginRequest>();
        group.MapGet("/me", Me).RequireAuthorization();
        // JWT é stateless: não há sessão para invalidar no servidor. O endpoint existe
        // por simetria com os fronts (que chamam POST /auth/logout ao deslogar).
        group.MapPost("/logout", () => TypedResults.NoContent()).RequireAuthorization();

        return api;
    }

    private static async Task<Created<AuthResponse>> Register(RegisterRequest request, AuthService service, CancellationToken ct)
    {
        var result = await service.RegisterAsync(request, ct);
        return TypedResults.Created($"/api/users/{result.User.Id}", result);
    }

    private static async Task<Ok<AuthResponse>> Login(LoginRequest request, AuthService service, CancellationToken ct) =>
        TypedResults.Ok(await service.LoginAsync(request, ct));

    private static async Task<Ok<UserResponse>> Me(ClaimsPrincipal principal, AuthService service, CancellationToken ct) =>
        TypedResults.Ok(await service.MeAsync(principal.GetUserId(), ct));
}
