using System.Security.Claims;
using Api.Common.Errors;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Api.Common.Security;

public static class ClaimsPrincipalExtensions
{
    // Id do usuário autenticado (claim "sub" do JWT).
    public static Guid GetUserId(this ClaimsPrincipal principal) =>
        Guid.TryParse(principal.FindFirstValue(JwtRegisteredClaimNames.Sub), out var id)
            ? id
            : throw new UnauthorizedException();
}
