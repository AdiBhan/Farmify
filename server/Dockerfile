# Use the official .NET Core SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the .csproj file to the working directory
COPY server.csproj /app/

# Restore the dependencies for the specific project
RUN dotnet restore /app/server.csproj

# Copy the rest of the application files to the working directory
COPY . /app/

# Build the application in Release mode
RUN dotnet publish /app/server.csproj -c Release -o out

# Use the .NET 8.0 runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Set the working directory for the runtime image
WORKDIR /app

# Copy the published files from the build image
COPY --from=build /app/out .

# Expose the port your app will run on (5090)
EXPOSE 5090

# Run the app
ENTRYPOINT ["dotnet", "server.dll"]
