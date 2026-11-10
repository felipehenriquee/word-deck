namespace Api.Common.Pagination;

// Query params de listagem (?page=1&perPage=20&sort=name&order=desc) — mesmo
// contrato das skills Nest/Express. Recebido nos endpoints via [AsParameters] e
// normalizado (defaults/limites) dentro do BaseService.GetAllAsync.
public sealed class PaginationQuery
{
    public const int DefaultPerPage = 20;
    public const int MaxPerPage = 100;

    public int? Page { get; set; }
    public int? PerPage { get; set; }
    public string? Sort { get; set; }
    public string? Order { get; set; }
}
