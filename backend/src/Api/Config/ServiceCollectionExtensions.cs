using System.Threading.RateLimiting;
using Api.Common.Errors;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Api.Config;

// Toda a configuração é lida de forma "lazy" (via IOptions no momento em que o
// serviço é resolvido), e não direto de builder.Configuration no Program.cs. Isso
// permite que os testes (WebApplicationFactory) sobrescrevam qualquer valor.
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAppSettings(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<JwtSettings>()
            .Bind(configuration.GetSection(JwtSettings.Section))
            .Validate(settings => settings.Secret.Length >= 32, "Jwt:Secret precisa ter ao menos 32 caracteres (HS256)")
            .ValidateOnStart();
        services.AddOptions<CorsSettings>().Bind(configuration.GetSection(CorsSettings.Section));
        services.AddOptions<RateLimitSettings>().Bind(configuration.GetSection(RateLimitSettings.Section));
        return services;
    }

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
        services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
            .Configure<IOptions<JwtSettings>>((options, jwtOptions) =>
            {
                var jwt = jwtOptions.Value;

                // Mantém os claims com os nomes originais do token ("sub", "role"...)
                // em vez de mapear para os URIs longos do ClaimTypes.
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwt.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwt.Audience,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = jwt.SigningKey(),
                    NameClaimType = JwtRegisteredClaimNames.Sub,
                    RoleClaimType = "role",
                    ClockSkew = TimeSpan.FromSeconds(30),
                };

                // Por padrão o JwtBearer responde 401/403 com corpo vazio; aqui as
                // respostas saem no mesmo formato JSON de qualquer outro erro da API.
                options.Events = new JwtBearerEvents
                {
                    OnChallenge = context =>
                    {
                        context.HandleResponse();
                        var message = context.AuthenticateFailure is null ? "Token não informado" : "Token inválido ou expirado";
                        return ErrorResponse.WriteAsync(context.HttpContext, StatusCodes.Status401Unauthorized, message);
                    },
                    OnForbidden = context =>
                        ErrorResponse.WriteAsync(context.HttpContext, StatusCodes.Status403Forbidden, "Acesso negado"),
                };
            });

        services.AddAuthorization();
        return services;
    }

    public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
    {
        services.AddCors();
        services.AddOptions<CorsOptions>()
            .Configure<IOptions<CorsSettings>>((cors, settings) =>
                cors.AddDefaultPolicy(policy => policy
                    .WithOrigins(settings.Value.Origins())
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()));
        return services;
    }

    // Rate limit global por IP (janela fixa) — proteção básica contra abuso/brute-force,
    // inclusive no /auth/login. Atrás de proxy reverso, configure ForwardedHeaders para
    // que RemoteIpAddress seja o IP real do cliente.
    public static IServiceCollection AddGlobalRateLimiter(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.OnRejected = (context, _) => new ValueTask(ErrorResponse.WriteAsync(
                context.HttpContext, StatusCodes.Status429TooManyRequests, "Muitas requisições, tente novamente mais tarde"));
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
            {
                var settings = httpContext.RequestServices.GetRequiredService<IOptions<RateLimitSettings>>().Value;
                return RateLimitPartition.GetFixedWindowLimiter(
                    httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = settings.PermitLimit,
                        Window = TimeSpan.FromSeconds(settings.WindowSeconds),
                        QueueLimit = 0,
                    });
            });
        });
        return services;
    }
}
