using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Api.Config;

// Settings tipados, lidos de appsettings*.json + variáveis de ambiente
// (formato Secao__Chave, ex: Jwt__Secret). Nenhum código deve ler IConfiguration
// diretamente — injete IOptions<XxxSettings> no lugar.
public sealed class JwtSettings
{
    public const string Section = "Jwt";

    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = "api";
    public string Audience { get; set; } = "api";
    public int ExpiresInMinutes { get; set; } = 1440;

    public SymmetricSecurityKey SigningKey() => new(Encoding.UTF8.GetBytes(Secret));
}

public sealed class CorsSettings
{
    public const string Section = "Cors";

    // Uma ou mais origens separadas por vírgula.
    public string Origin { get; set; } = "http://localhost:5173";

    public string[] Origins() =>
        Origin.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
}

public sealed class RateLimitSettings
{
    public const string Section = "RateLimit";

    public int PermitLimit { get; set; } = 100;
    public int WindowSeconds { get; set; } = 60;
}
