using Api.Common.Pagination;
using Api.Common.Validation;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Api.Features.Users;

public static class UsersEndpoints
{
    public static IEndpointRouteBuilder MapUsersEndpoints(this IEndpointRouteBuilder api)
    {
        // Toda a feature users exige autenticação.
        var group = api.MapGroup("/users").WithTags("Users").RequireAuthorization();

        group.MapGet("/", GetAll);
        group.MapGet("/{id:guid}", GetById);
        group.MapPost("/", Create).WithValidation<CreateUserRequest>();
        group.MapPatch("/{id:guid}", Update).WithValidation<UpdateUserRequest>();
        group.MapDelete("/{id:guid}", Delete);

        return api;
    }

    private static async Task<Ok<PaginatedResponse<UserResponse>>> GetAll(
        [AsParameters] PaginationQuery query, UsersService service, CancellationToken ct)
    {
        var result = await service.GetAllAsync(query, ct);
        return TypedResults.Ok(result.Map(UserMapper.ToResponse));
    }

    private static async Task<Ok<UserResponse>> GetById(Guid id, UsersService service, CancellationToken ct)
    {
        var user = await service.GetByIdAsync(id, ct);
        return TypedResults.Ok(user.ToResponse());
    }

    private static async Task<Created<UserResponse>> Create(CreateUserRequest request, UsersService service, CancellationToken ct)
    {
        var user = await service.CreateAsync(request, ct);
        return TypedResults.Created($"/api/users/{user.Id}", user.ToResponse());
    }

    private static async Task<Ok<UserResponse>> Update(Guid id, UpdateUserRequest request, UsersService service, CancellationToken ct)
    {
        var user = await service.UpdateAsync(id, request, ct);
        return TypedResults.Ok(user.ToResponse());
    }

    private static async Task<NoContent> Delete(Guid id, UsersService service, CancellationToken ct)
    {
        await service.DeleteAsync(id, ct);
        return TypedResults.NoContent();
    }
}
