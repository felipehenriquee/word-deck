namespace Api.Features.Health;

public static class HealthEndpoints
{
    // Rota pública, sem RequireAuthorization — usada por healthchecks do orquestrador.
    public static IEndpointRouteBuilder MapHealthEndpoints(this IEndpointRouteBuilder api)
    {
        api.MapGet("/health", () => TypedResults.Ok(new { status = "ok", timestamp = DateTime.UtcNow }))
            .WithTags("Health");
        return api;
    }
}
