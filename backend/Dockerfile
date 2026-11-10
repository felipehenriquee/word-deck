# syntax=docker/dockerfile:1

# ---- Stage 1: build ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restore separado do código para aproveitar cache de camadas.
COPY Directory.Build.props ./
COPY src/Api/Api.csproj src/Api/
RUN dotnet restore src/Api/Api.csproj

COPY src/ src/
RUN dotnet publish src/Api/Api.csproj -c Release -o /app/publish --no-restore

# ---- Stage 2: runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=3000

COPY --from=build /app/publish .

# Usuário não-root já definido pela imagem oficial do .NET.
USER $APP_UID

EXPOSE 3000
# As migrations são aplicadas pela própria API no start quando
# Database__MigrateOnStartup=true (ver docker-compose.yml e Database/DatabaseExtensions.cs).
ENTRYPOINT ["dotnet", "Api.dll"]
