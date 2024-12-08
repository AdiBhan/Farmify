# Development runtime stage 
FROM mcr.microsoft.com/dotnet/sdk:8.0 
WORKDIR /app 
COPY . .
ENV ASPNETCORE_URLS=http://0.0.0.0:4000
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV ASPNETCORE_ENVIRONMENT=Development
EXPOSE 4000 
ENTRYPOINT ["dotnet", "watch", "run", "--project", "server.csproj", "--no-launch-profile"]