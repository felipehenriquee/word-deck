using System.Security.Claims;
using Api.Config;
using Api.Features.Users;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Api.Features.Auth;

// Assina o JWT (HS256). A validação dos tokens recebidos é feita pelo JwtBearer,
// configurado em Config/ServiceCollectionExtensions.cs com as mesmas JwtSettings.
public sealed class JwtTokenService(IOptions<JwtSettings> options)
{
    private readonly JsonWebTokenHandler _handler = new();

    public string CreateToken(User user)
    {
        var settings = options.Value;
        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
            [
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("role", user.Role),
            ]),
            Issuer = settings.Issuer,
            Audience = settings.Audience,
            Expires = DateTime.UtcNow.AddMinutes(settings.ExpiresInMinutes),
            SigningCredentials = new SigningCredentials(settings.SigningKey(), SecurityAlgorithms.HmacSha256),
        };

        return _handler.CreateToken(descriptor);
    }
}
