using Api.Common.Entities;

namespace Api.Features.Users;

// Espelha o tipo User das 3 skills de frontend e o model das skills Nest/Express.
// "Role" é string (e não enum) de propósito, como no Prisma da skill Express: os
// valores válidos são garantidos pelos validators (UserValidators.cs).
public sealed class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = Roles.Viewer;
    public bool Active { get; set; } = true;
}

public static class Roles
{
    public const string Admin = "admin";
    public const string Editor = "editor";
    public const string Viewer = "viewer";

    public static readonly IReadOnlySet<string> All = new HashSet<string> { Admin, Editor, Viewer };
}
