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

Frontend .env file
`
EXPO_PUBLIC_BACKEND_URL=http://localhost:4000
EXPO_PUBLIC_REACT_NATIVE_FRONTEND_URL=https://localhost
EXPO_PUBLIC_SUPABASE_PROJECT_URL=https://allbizkxjccwarsftcrq.supabase.co
EXPO_PUBLIC_SUPABASE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbGJpemt4amNjd2Fyc2Z0Y3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNTMzMTcsImV4cCI6MjA0MzYyOTMxN30.I-4Z7pZXQRYiaDeV8q5qFcP9WgEOX7L8gU4GAO1bKb4`
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



## Scrum Nov 12-19


### Work this week:

#### Simeon:
-Adjusted db schema including:
  1. Merging Auction and Product tables
  2. Adding start/end price+time to bid
  3. Added imageURL col to Product table
  4. FK from bid referencing new Product table
  5. Trigger to decrement Product amount when a purchase is made


#### Adi:
1. Added icons for navigation bar using vector-icons, and hid non-important tabs
2. Added Contact Information, Payment, Account Info and Previous Purchases to settings (conditionally render based on Seller or Buyer)
3. Used Supabase SDK to build out functionality where on submitting a new item, Primary and Gallery Photo's are automatically stored in Supabase's Storage Buckets  (AWS s3 instance)


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


## Scrum Nov 24-30

## Adi

1. Fixed OAuth Verification (Directly connmects from React Native frontend) to Google OAuth
2. Redesigned pages to make it look more modern / sleak (new fonts, containers, dropshadows, icons)



## Simeon

1. integrated paypal api to require sandbox payment before placing a bid
2. Adjudted details.tsx in frontend to make popup for payment and confirm/redirect after completed
Plan this week:
1. Finalize statistics page/controller
2. Implement rating system for backend. 
3. Add more information to details.tsx (address, map, option for delivery/pickup)
4. Create more sellers in paypal&backend to test
5. adjust cost display (create formatted string like " (4.99 * 5 = $24.95 ))


 <br><br>
  Whats left:


  1. Store payment/delivery status in backend when a bid is created (stub delivery tracking?)

  2. decide how doordash is going to be used in the project

  3. Store products/auctions in backend when listing is made (newlisting.tsx)

  4. Display photogallery in details.tsx

  5. display user profile picture (decide where)

  4. Error/Exception handling for all frontend functionality 
      - Make sure only valid inputs for creating bid, auction, etc
      - Shouldn't be able to set end price higher than start price
      - Shouldn't be able to make end price same as start price (at least half value)
      - Minimum duration of auctions

  5. Replace hardcoded userData in frontend by tracking state of which user is logged in
    - ONLY show past transactions for that user
  
  6. Modify details page to include link to ABOUT US page for that seller

  7. Create trigger for updating seller rating when one of their products is rated

  8. Add amount remaining to details.tsx page

  9. add display of photogallery images for each product.

  10. Document stubbing
    - Written reviews for sellers
    - Allowing sellers to rate buyers
    - Allow for non-linear decrease of price in dutch auction (exponential, log, etc)
    - Messaging buyers/sellers on status updates
    - Update of delivery status

  



