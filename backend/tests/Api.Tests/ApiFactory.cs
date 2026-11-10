using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace Api.Tests;

// Sobe a API em memória (sem abrir porta) para os testes de integração — o
// equivalente ao createApp() + Supertest da skill Express.
public sealed class ApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, config) => config.AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Jwt:Secret"] = "test-only-secret-with-at-least-32-characters",
            ["Database:MigrateOnStartup"] = "false",
            ["RateLimit:PermitLimit"] = "1000",
        }));
    }
}
