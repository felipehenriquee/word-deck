using System.Data.Common;
using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;

namespace Api.Common.Errors;

// Handler global de exceções (equivalente ao error.middleware da skill Express).
// Normaliza qualquer erro no formato do ErrorResponse, incluindo erros conhecidos
// do EF Core (violação de unicidade -> 409, registro sumido no update -> 404).
public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger, IHostEnvironment environment)
    : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        (int StatusCode, object Message) error = exception switch
        {
            HttpException http => (http.StatusCode, http.Message),
            ValidationException validation => (StatusCodes.Status400BadRequest, validation.Errors
                .Select(failure => $"{JsonNamingPolicy.CamelCase.ConvertName(failure.PropertyName)}: {failure.ErrorMessage}")
                .ToArray()),
            BadHttpRequestException badRequest => (badRequest.StatusCode, "Requisição inválida: corpo ou parâmetros malformados"),
            DbUpdateConcurrencyException => (StatusCodes.Status404NotFound, "Registro não encontrado"),
            DbUpdateException db when IsUniqueViolation(db) => (StatusCodes.Status409Conflict, "Registro já existe (violação de unicidade)"),
            DbUpdateException => (StatusCodes.Status400BadRequest, "Erro de banco de dados"),
            // Em produção não vazamos a mensagem original de erros inesperados.
            _ => (StatusCodes.Status500InternalServerError, environment.IsProduction() ? "Erro interno do servidor" : exception.Message),
        };

        if (error.StatusCode >= StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Erro não tratado em {Method} {Path}", httpContext.Request.Method, httpContext.Request.Path);
        }

        await ErrorResponse.WriteAsync(httpContext, error.StatusCode, error.Message);
        return true;
    }

    // O MySqlException do provider da Oracle (MySql.Data) não preenche DbException.SqlState,
    // então a violação de unicidade é detectada pelo código nativo do MySQL (1062 = ER_DUP_ENTRY).
    // As outras regras cobrem o SQLite dos testes e um eventual provider que preencha SqlState.
    private static bool IsUniqueViolation(DbUpdateException exception) => exception.InnerException switch
    {
        MySqlException { Number: (int)MySqlErrorCode.DuplicateKeyEntry } => true, // MySQL duplicate entry
        DbException { SqlState: "23505" } => true, // PostgreSQL unique_violation
        DbException db when db.Message.Contains("UNIQUE constraint failed", StringComparison.OrdinalIgnoreCase) => true, // SQLite
        _ => false,
    };
}
