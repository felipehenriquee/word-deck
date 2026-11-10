namespace Api.Common.Pagination;

// Mesmo shape do PaginatedResponse<T> das 3 skills de frontend:
// { data, total, page, perPage, totalPages }.
public sealed record PaginatedResponse<T>(IReadOnlyList<T> Data, int Total, int Page, int PerPage, int TotalPages)
{
    public static PaginatedResponse<T> Create(IReadOnlyList<T> data, int total, int page, int perPage) =>
        new(data, total, page, perPage, Math.Max(1, (int)Math.Ceiling(total / (double)perPage)));

    // Converte os itens (ex: entidade -> DTO de resposta) mantendo os metadados.
    public PaginatedResponse<TOut> Map<TOut>(Func<T, TOut> selector) =>
        new(Data.Select(selector).ToList(), Total, Page, PerPage, TotalPages);
}
