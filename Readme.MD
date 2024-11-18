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



Scrum Nov 12-19


Work this week:

Simeon:
-Adjusted db schema including:
  1. Merging Auction and Product tables
  2. Adding start/end price+time to bid
  3. Added imageURL col to Product table
  4. FK from bid referencing new Product table
  5. Trigger to decrement Product amount when a purchase is made


Adi:
1. Added icons for navigation bar using vector-icons, and hid non-important tabs
2. Added Contact Information, Payment, Account Info and Previous Purchases to settings (conditionally render based on Seller or Buyer)



-Adjusted models to fit new DB schema in backend

-Created bid & Product controller with endpoints for:
   1. Viewing all past bids, past transactions by ID
   2. Creating a bid
   3. Viewing all products, products by ID
   
- Added new functionality to frontend including:
  1. Replace hardcoded auction data with function to fetch products from backend
  2. Added display of quantity remaining (was mising)
  3. Added function to calculate Current price from the startPrice,EndPrice,StartTime,Endtime
      (currprice = startPrice + (endPrice - startPrice) * progress)
  4. Added function to display Time remaining for each auction
  5. Added functionality to place a bid on a product and view it in your past transactions. 
  6. Automated quantity decrementing products after a purchase is made



  Whats left:

  1. Link up paypal API when a purchase is being made - store needed payment/delivery data

  2. decide how doordash is going to be used in the project

  3. Add functionality to create a new product (ADI)

  4. Come up with a way to store photogallery of product (store in details page)

  4. Error/Exception handling for all frontend functionality 
      - Make sure only valid inputs for creating bid, auction, etc
      - Shouldn't be able to set end price higher than start price
      - Shouldn't be able to make end price same as start price (at least half value)
      - Minimum duration of auctions

  5. Replace hardcoded userData in frontend by tracking state of which user is logged in
    - ONLY show past transactions for that user
  
  6. Modify details page to include link to ABOUT US page for that seller

  7. Create trigger for updating seller rating when one of their products is rated

  8. Display real site stats instead of mock data on stats page

  9. Update NavBar




