namespace Api.Common.Errors;

// Erros HTTP tipados. O GlobalExceptionHandler normaliza qualquer HttpException
// lançada em qualquer camada (services, endpoints, filtros) para o formato de
// resposta padrão da API: { statusCode, message, path, timestamp }.
public class HttpException(int statusCode, string message) : Exception(message)
{
    public int StatusCode { get; } = statusCode;
}

public sealed class BadRequestException(string message = "Requisição inválida")
    : HttpException(StatusCodes.Status400BadRequest, message);

public sealed class UnauthorizedException(string message = "Não autenticado")
    : HttpException(StatusCodes.Status401Unauthorized, message);

public sealed class ForbiddenException(string message = "Acesso negado")
    : HttpException(StatusCodes.Status403Forbidden, message);

public sealed class NotFoundException(string message = "Registro não encontrado")
    : HttpException(StatusCodes.Status404NotFound, message);

public sealed class ConflictException(string message = "Conflito: registro já existe")
    : HttpException(StatusCodes.Status409Conflict, message);
