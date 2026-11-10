using FluentValidation;

namespace Api.Features.Users;

public sealed class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Nome é obrigatório").MinimumLength(2).WithMessage("Nome deve ter ao menos 2 caracteres");
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email é obrigatório").EmailAddress().WithMessage("Email inválido");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Senha é obrigatória").MinimumLength(6).WithMessage("Senha deve ter ao menos 6 caracteres");
        RuleFor(x => x.Role)
            .Must(role => Roles.All.Contains(role!))
            .When(x => x.Role is not null)
            .WithMessage("Role deve ser admin, editor ou viewer");
    }
}

// Mesmas regras do create, mas todas opcionais (equivalente ao createSchema.partial()).
public sealed class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(x => x.Name).MinimumLength(2).When(x => x.Name is not null).WithMessage("Nome deve ter ao menos 2 caracteres");
        RuleFor(x => x.Email).EmailAddress().When(x => x.Email is not null).WithMessage("Email inválido");
        RuleFor(x => x.Password).MinimumLength(6).When(x => x.Password is not null).WithMessage("Senha deve ter ao menos 6 caracteres");
        RuleFor(x => x.Role)
            .Must(role => Roles.All.Contains(role!))
            .When(x => x.Role is not null)
            .WithMessage("Role deve ser admin, editor ou viewer");
    }
}
