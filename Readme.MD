# Farmify Overview

Farmify is a mobile application and digital platform   (Built with C# ASP.NET and React Native), that enables farmers to sell local produce directly to buyers, providing an affordable and accessible marketplace for fresh, local goods.

---

## Prerequisites
- Node.js and npm
- .NET SDK
- Git
- Expo CLI
## Schema
![Schema](./Images/Schema_11-1-2024.png)
(https://drawsql.app/teams/bu-5/diagrams/farmify)

---

## Major Documentation APIs

- [DoorDash](https://developer.doordash.com/en-US/docs/drive/tutorials/get_started/) – Integration for delivery services.
- [PayPal](https://developer.paypal.com/api/rest/) – Payment processing API for secure transactions.
- [OAuth](https://developers.google.com/identity/protocols/oauth2) – User authentication and authorization.

---

## Built With

<div style="display: flex; flex-direction: row; gap: 15px; align-items: center; justify-content: center;">
  <a href="https://reactnative.dev" target="_blank">
    <img src="./Images/ReactNative.png" alt="ReactNative" width="100" height="100" />
  </a>
  <a href="https://dotnet.microsoft.com/en-us/apps/aspnet" target="_blank">
    <img src="./Images/aspnetcore.png" alt="ASP.NET Core" width="100" height="100" />
  </a>
  <a href="https://supabase.com/" target="_blank">
    <img src="./Images/SupabaseSQL.png" alt="Supabase SQL Cloud Database" width="100" height="100" />
  </a>
</div>

---

## Installation Guide
    1. git clone -b Feature/Adi-Bhan git@github.com:AdiBhan/Farmify.git
### 1. Clone the Repository


## Frontend (React Native)
The frontend runs on port 8080 and is built using React Native with Expo.

1. Install Expo CLI globally: `npm install -g expo-cli`
2. Install dependencies: `cd client && npm install`
3. Start Application: `npm start`
4. Press 'W' to open in web browser


## Backend (C# .NET ASP)
The backend runs on port 4000.

1. Navigate to the server directory: `cd server`
2. Create a .env file in the server directory and add the following configurations:
```javascript
GOOGLE_CLIENT_SECRET=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
GOOGLE_CLIENT_ID=843265692538-rjf3cnn9ocva0tbu79n1dfhjd3g11nr3.apps.googleusercontent.com
```
3. Start the backend server: `dotnet run`


## Development

- Frontend and backend must be run in separate terminal windows
- Frontend will be available at: http://localhost:8080
- Backend will be available at: http://localhost:4000

## API Endpoints
 - `/login` - Handle user authentication
 - `/success` - Handle successful authentication


## Environment Variables

| Variable | Description |
|----------|-------------|
|  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 | Secret key for Google OAuth |
|  843265692538-rjf3cnn9ocva0tbu79n1dfhjd3g11nr3.apps.googleusercontent.com Client ID for Google OAuth |
