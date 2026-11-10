using Api.Common.Errors;
using FluentValidation;

namespace Api.Common.Validation;

// Endpoint filter que valida o argumento TRequest com o IValidator<TRequest>
// correspondente (FluentValidation) antes de chegar no handler — equivalente ao
// validate(schema) da skill Express. Falhas viram ValidationException, que o
// GlobalExceptionHandler transforma em 400 com uma mensagem por campo.
public sealed class ValidationFilter<TRequest> : IEndpointFilter where TRequest : class
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var request = context.Arguments.OfType<TRequest>().FirstOrDefault()
            ?? throw new BadRequestException("Corpo da requisição é obrigatório");

        // Resolvido por requisição (e não no construtor) porque os validators são scoped.
        var validator = context.HttpContext.RequestServices.GetRequiredService<IValidator<TRequest>>();
        await validator.ValidateAndThrowAsync(request, context.HttpContext.RequestAborted);

        return await next(context);
    }
}

public static class ValidationExtensions
{
    public static RouteHandlerBuilder WithValidation<TRequest>(this RouteHandlerBuilder builder) where TRequest : class =>
        builder.AddEndpointFilter<ValidationFilter<TRequest>>();
}
