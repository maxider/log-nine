FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["log-nine-backend/log-nine-backend.csproj", "log-nine-backend/"]
RUN dotnet restore "log-nine-backend/log-nine-backend.csproj"
COPY . .
WORKDIR "/src/log-nine-backend"
RUN dotnet build "log-nine-backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "log-nine-backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "log-nine-backend.dll"]
