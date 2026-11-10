namespace Api.Common.Errors;

// Mesmo formato de erro das skills Nest e Express ({ statusCode, message, path,
// timestamp }), para que os fronts tratem erros de forma idêntica
// independentemente do backend. "message" é string ou string[] (erros de validação).
public sealed record ErrorResponse(int StatusCode, object Message, string Path, DateTime Timestamp)
{
    public static ErrorResponse Create(HttpContext context, int statusCode, object message) =>
        new(statusCode, message, $"{context.Request.PathBase}{context.Request.Path}{context.Request.QueryString}", DateTime.UtcNow);

    public static Task WriteAsync(HttpContext context, int statusCode, object message)
    {
        context.Response.StatusCode = statusCode;
        return context.Response.WriteAsJsonAsync(Create(context, statusCode, message));
    }
}
