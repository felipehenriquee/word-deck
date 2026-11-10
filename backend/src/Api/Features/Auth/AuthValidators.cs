using FluentValidation;

namespace Api.Features.Auth;

public sealed class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Nome é obrigatório").MinimumLength(2).WithMessage("Nome deve ter ao menos 2 caracteres");
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email é obrigatório").EmailAddress().WithMessage("Email inválido");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Senha é obrigatória").MinimumLength(6).WithMessage("Senha deve ter ao menos 6 caracteres");
    }
}

public sealed class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email é obrigatório").EmailAddress().WithMessage("Email inválido");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Senha é obrigatória");
    }
}
