using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Api.Tests;

// Estes testes não tocam o banco: a validação (FluentValidation) e a autenticação
// (JwtBearer) rodam antes de qualquer acesso ao EF Core, então não precisam de um
// MySQL rodando para passar.
public sealed class ValidationTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Register_ComBodyInvalido_Devolve400ComMensagensPorCampo()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/register", new { email = "not-an-email" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(400, body.GetProperty("statusCode").GetInt32());
        Assert.Equal(JsonValueKind.Array, body.GetProperty("message").ValueKind);
    }

    [Fact]
    public async Task Register_ComJsonMalformado_Devolve400Padronizado()
    {
        var content = new StringContent("{ invalido", System.Text.Encoding.UTF8, "application/json");
        var response = await _client.PostAsync("/api/auth/register", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(400, body.GetProperty("statusCode").GetInt32());
    }

    [Fact]
    public async Task GetUsers_SemToken_Devolve401Padronizado()
    {
        var response = await _client.GetAsync("/api/users");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(401, body.GetProperty("statusCode").GetInt32());
    }

    [Fact]
    public async Task RotaInexistente_Devolve404Padronizado()
    {
        var response = await _client.GetAsync("/api/rota-que-nao-existe");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(404, body.GetProperty("statusCode").GetInt32());
        Assert.Equal("/api/rota-que-nao-existe", body.GetProperty("path").GetString());
    }
}
