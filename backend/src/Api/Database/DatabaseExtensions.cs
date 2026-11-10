using Microsoft.EntityFrameworkCore;

namespace Api.Database;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection services)
    {
        services.AddDbContext<AppDbContext>((serviceProvider, options) =>
        {
            var connectionString = serviceProvider.GetRequiredService<IConfiguration>().GetConnectionString("Default");

            // MySQL via provider oficial da Oracle (MySql.EntityFrameworkCore).
            options.UseMySQL(connectionString!);
        });
        return services;
    }

    // Aplica migrations pendentes no start quando Database:MigrateOnStartup=true
    // (ligado no docker-compose.yml) — equivalente ao "prisma migrate deploy" do
    // docker-entrypoint.sh da skill Express. Em dev, prefira "dotnet ef database update".
    public static async Task MigrateDatabaseAsync(this WebApplication app)
    {
        if (!app.Configuration.GetValue<bool>("Database:MigrateOnStartup"))
        {
            return;
        }

        await using var scope = app.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();
    }
}
