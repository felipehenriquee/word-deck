using Api.Common.Errors;
using Api.Common.Security;
using Api.Config;
using Api.Database;
using Api.Features.Auth;
using Api.Features.Health;
using Api.Features.Users;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options => options.AddServerHeader = false);

// Infraestrutura: settings tipados, banco, auth JWT, CORS, rate limit, erros.
builder.Services.AddAppSettings(builder.Configuration);
builder.Services.AddDatabase();
builder.Services.AddJwtAuthentication();
builder.Services.AddCorsPolicy();
builder.Services.AddGlobalRateLimiter();
builder.Services.AddResponseCompression(options => options.EnableForHttps = true);
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
// Faz erros de binding (JSON malformado, query inválida) virarem exceção e passarem
// pelo GlobalExceptionHandler, em vez de um 400 vazio fora do formato padrão.
builder.Services.Configure<RouteHandlerOptions>(options => options.ThrowOnBadRequest = true);
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddOpenApi();

// Services das features — ao criar uma feature nova, registre o service dela aqui.
builder.Services.AddScoped<UsersService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddSingleton<JwtTokenService>();

var app = builder.Build();

app.UseExceptionHandler(_ => { });
app.UseSecurityHeaders();
app.UseResponseCompression();
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // GET /openapi/v1.json
}

// Endpoints das features — ao criar uma feature nova, mapeie os endpoints dela aqui.
var api = app.MapGroup("/api");
api.MapHealthEndpoints();
api.MapAuthEndpoints();
api.MapUsersEndpoints();

// Qualquer rota não mapeada vira um 404 no formato padrão de erro da API.
app.MapFallback("{*path}", (HttpContext context) => TypedResults.Json(
    ErrorResponse.Create(context, StatusCodes.Status404NotFound,
        $"Rota \"{context.Request.Method} {context.Request.Path}\" não encontrada"),
    statusCode: StatusCodes.Status404NotFound));

await app.MigrateDatabaseAsync();
await app.RunAsync();

// Exposto para o WebApplicationFactory dos testes de integração.
public partial class Program;
