# backend

Backend ASP.NET Core (.NET 10, Minimal APIs), organizado por feature, com EF Core, autenticação
JWT e um `BaseService<TEntity>` de CRUD genérico que cada feature estende.

## Rodando localmente

```bash
dotnet tool restore                     # instala o dotnet-ef (local, versionado em .config/)
docker compose up -d db                 # sobe o MySQL via Docker
dotnet ef migrations add Init -p src/Api -o Database/Migrations   # só na primeira vez
dotnet ef database update -p src/Api
dotnet run --project src/Api
```

A API sobe em `http://localhost:3000/api`. Em desenvolvimento, o documento OpenAPI fica em
`http://localhost:3000/openapi/v1.json`.

A configuração vem de `src/Api/appsettings.json` + `appsettings.Development.json`, e pode ser
sobrescrita por variáveis de ambiente no formato `Secao__Chave` (ex: `Jwt__Secret`,
`ConnectionStrings__Default`, `Cors__Origin`).

## Comandos

| Comando | O que faz |
|---|---|
| `dotnet run --project src/Api` | Sobe a API |
| `dotnet watch --project src/Api` | Sobe a API com hot reload |
| `dotnet build` | Compila a solution |
| `dotnet test` | Testes (xUnit + WebApplicationFactory + SQLite em memória) |
| `dotnet format` | Formata o código conforme o `.editorconfig` |
| `dotnet ef migrations add <Nome> -p src/Api -o Database/Migrations` | Cria uma migration a partir das mudanças no modelo |
| `dotnet ef database update -p src/Api` | Aplica migrations pendentes |

## Arquitetura

Cada domínio vive em `src/Api/Features/<Feature>/`, com sua entidade, configuração EF, DTOs,
validators, service e endpoints. Código compartilhado entre features vive em `src/Api/Common/`
(nunca o contrário — `Common/` não deve importar de `Features/`).

O CRUD genérico (`GetAll`/`GetById`/`Create`/`Update`/`Delete`) vive em
`src/Api/Common/Services/BaseService.cs`; qualquer feature com um recurso CRUD deve estender essa
classe em vez de reescrever esses métodos.

## Docker

```bash
cp .env.example .env   # ajuste JWT_SECRET e CORS_ORIGIN
docker compose up --build
```

Sobe a API + MySQL. Com `Database__MigrateOnStartup=true` (já definido no compose), a API aplica
as migrations pendentes antes de começar a atender requisições.
