#  Farmify Overview 🌟


Farmify is revolutionizing the way farmers connect with their communities. Built with C# ASP.NET 8 and React Native, this innovative mobile platform creates a seamless marketplace for fresh, local produce. Empowering farmers to reach buyers directly, Farmify ensures affordability, accessibility, and freshness in every transaction. Say goodbye to middlemen and hello to a better way to buy and sell local goods!


## App Showcase

Take a quick look at some key features of Farmify in action:

<div align="center" style="display: flex; gap: 20px; justify-content: center; align-items: center;">

  <div style="text-align: center;">
    <img src="./Images/homescreen.gif" alt="Home Screen" width="300"/>
    <p><i>Home Screen – Explore available products and navigate the app effortlessly.</i></p>
  </div>


  <div style="text-align: center;">
    <img src="./Images/auction.gif" alt="Auction Page" width="300"/>
    <p><i>Auction Page – Seamlessly bid on fresh produce from local sellers.</i></p>
  </div>

  <div style="text-align: center;">
    <img src="./Images/purchase.gif" alt="Purchase Flow" width="300"/>
    <p><i>Purchase Flow – Confirm purchases with a streamlined checkout process.</i></p>
  </div>



</div>


## Schema

<p align="center">
  <img src="./Images/Schema.gif" alt="Database Schema">
</p>
<p align="center"><i>View the full schema at <a href="https://supabase.com/dashboard/project/allbizkxjccwarsftcrq/database/schemas" target="_blank"><b>Supabase: Farmify Schema</b></a>.</i></p>


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
    <a href="https://supabase.com/" target="_blank">
    <img src="./Images/docker.png" alt="Supabase SQL Cloud Database" width="100" height="100" />
  </a>
    <a href="https://supabase.com/" target="_blank">
    <img src="./Images/oauth.png" alt="Supabase SQL Cloud Database" width="100" height="100" />
  </a>
    <a href="https://supabase.com/" target="_blank">
    <img src="./Images/doordash.jpg" alt="Supabase SQL Cloud Database" width="100" height="100" />
  </a>
    <a href="https://supabase.com/" target="_blank">
    <img src="./Images/paypal.png" alt="Supabase SQL Cloud Database" width="100" height="100" />
  </a>
    <a href="https://supabase.com/" target="_blank">
    <img src="./Images/expo.svg" alt="Supabase SQL Cloud Database" width="100" height="100" />
  </a>

  
</div>

---



## API Endpoints

### PayPal Endpoints
| Method | Endpoint                     | Description                                    |
|--------|------------------------------|------------------------------------------------|
| POST   | `/api/paypal/create-order`   | Creates a new PayPal order                    |
| POST   | `/api/paypal/capture-order`  | Captures a PayPal order after approval        |

---

### Product Endpoints
| Method | Endpoint                  | Description                                    |
|--------|---------------------------|------------------------------------------------|
| POST   | `/api/products`           | Adds a new product                            |
| GET    | `/api/products`           | Retrieves all products                        |
| GET    | `/api/products/{id}`      | Retrieves a specific product by its ID        |

---

### Seller Endpoints
| Method | Endpoint                     | Description                                    |
|--------|------------------------------|------------------------------------------------|
| GET    | `/api/seller/account`        | Fetches the seller's account details          |
| PUT    | `/api/seller/account`        | Updates the seller's account details          |
| GET    | `/api/seller/business`       | Retrieves the seller's business information   |
| PUT    | `/api/seller/business`       | Updates the seller's business information     |
| GET    | `/api/seller/{id}`           | Fetches details of a seller by their ID       |

---

### User Endpoints
| Method | Endpoint                      | Description                                    |
|--------|-------------------------------|------------------------------------------------|
| GET    | `/api/users/oauth/login`      | Handles OAuth login                           |
| POST   | `/api/users/login`            | Logs in a user                                |
| POST   | `/api/users/register`         | Registers a new user                          |
| PUT    | `/api/users/update`           | Updates user details                          |

---

### Bids Endpoints
| Method | Endpoint                  | Description                                    |
|--------|---------------------------|------------------------------------------------|
| GET    | `/api/bids`               | Retrieves all bids                            |
| POST   | `/api/bids`               | Creates a new bid                             |
| GET    | `/api/bids/{id}`          | Fetches bid details by ID                     |
| PUT    | `/api/bids/{id}`          | Updates a bid by its ID                       |

---

### Diagnostic Endpoints
| Method | Endpoint                                | Description                                    |
|--------|-----------------------------------------|------------------------------------------------|
| GET    | `/api/diagnostic/tables`               | Retrieves all diagnostic tables               |
| GET    | `/api/diagnostic/table-details/{name}` | Fetches details of a specific table           |
| GET    | `/api/diagnostic/table-content/{name}` | Fetches content of a specific diagnostic table|

---

### DoorDash Endpoints
| Method | Endpoint                          | Description                                    |
|--------|-----------------------------------|------------------------------------------------|
| POST   | `/api/deliveries/generate`        | Generates a new DoorDash delivery             |
| GET    | `/api/deliveries/track/{id}`      | Tracks a delivery by its ID                   |

---

### Payment Endpoints
| Method | Endpoint                       | Description                                    |
|--------|--------------------------------|------------------------------------------------|
| GET    | `/api/payment/payment-failed`  | Handles failed payments                       |
| GET    | `/api/payment/payment-success` | Handles successful payments                   |
| GET    | `/api/payment/cards`           | Fetches all saved payment cards               |
| POST   | `/api/payment/cards`           | Adds a new payment card                       |
| PUT    | `/api/payment/cards/{id}`      | Updates a payment card by its ID              |
| DELETE | `/api/payment/cards/{id}`      | Deletes a payment card by its ID              |

---

### Server Endpoints
| Method | Endpoint   | Description                         |
|--------|------------|-------------------------------------|
| GET    | `/`        | Base endpoint for server health     |

---

### Swagger Endpoints

#### Swagger Endpoints 1
<p align="center">
  <img src="./Images/swagger_endpoints1.png" alt="Swagger Endpoints 1">
</p>
<p align="center"><i>You can view these endpoints at <a href="http://localhost:4000/swagger/index.html" target="_blank"><b>http://localhost:4000/swagger/index.html</b></a> once the backend is running.</i></p>

---

#### Swagger Endpoints 2
<p align="center">
  <img src="./Images/swagger_endpoints2.png" alt="Swagger Endpoints 2">
</p>
<p align="center"><i>You can view these endpoints at <a href="http://localhost:4000/swagger/index.html" target="_blank"><b>http://localhost:4000/swagger/index.html</b></a> once the backend is running.</i></p>


## Prerequisites

To set up Farmify, ensure the following tools are installed:

- **[Node.js v18.x](https://nodejs.org/en/download/)** – Used for managing frontend dependencies and running the React Native app.
- **[.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)** – Required for running the C# ASP.NET backend.
- **[Git](https://git-scm.com/downloads)** – For cloning the repository.
- **[Expo CLI v52.x](https://docs.expo.dev/get-started/installation/)** – Required to run the React Native application.



---

## Major Documentation APIs

- [DoorDash](https://developer.doordash.com/en-US/docs/drive/tutorials/get_started/) – Integration for delivery services.
- [PayPal](https://developer.paypal.com/api/rest/) – Payment processing API for secure transactions.
- [OAuth](https://developers.google.com/identity/protocols/oauth2) – User authentication and authorization.

---


<h2>Installation Guide</h2>

<p>Follow these steps to set up Farmify locally. If you have Docker installed, you can skip the manual setup and use Docker Compose to build and run both the frontend and backend effortlessly. Make sure to set up the <code>.env</code> file with the required environment variables before starting the application.</p>


<hr />

<h3>Quick Setup with Docker</h3>
<ol>
  <li>Ensure Docker is installed: <a href="https://www.docker.com/products/docker-desktop/" target="_blank">Download Docker</a>.</li>
  <li>Run the following command in the project root directory:
    <pre><code>docker-compose up</code></pre>
  </li>
  <li>Once the services are running:
    <ul>
      <li>Frontend: <a href="http://localhost:8080" target="_blank">http://localhost:8081</a></li>
      <li>Backend: <a href="http://localhost:4000" target="_blank">http://localhost:4000</a></li>
    </ul>
  </li>
</ol>

<hr />

<h3>Manual Setup</h3>

<h4>Clone the Repository</h4>
<pre><code>git clone -b Feature/Adi-Bhan git@github.com:AdiBhan/Farmify.git
cd Farmify
</code></pre>

<h4>Frontend Setup (React Native)</h4>
<p>The frontend is built using React Native with Expo and runs on port 8080.</p>
<ol>
  <li>Install Expo CLI globally:
    <pre><code>npm install -g expo-cli@52.0.0</code></pre>
  </li>
  <li>Navigate to the <code>client</code> directory and install dependencies:
    <pre><code>cd client
npm install</code></pre>
  </li>
  <li>Start the application:
    <pre><code>npm start</code></pre>
  </li>
  <li>Press <code>W</code> in the Expo CLI to open the application in your web browser.</li>
</ol>

<h5>Frontend .env File</h5>
<p>Create a <code>.env</code> file in the <code>client/</code> directory with the following configuration:</p>
<pre><code>EXPO_PUBLIC_BACKEND_URL=http://localhost:4000
EXPO_PUBLIC_REACT_NATIVE_FRONTEND_URL=https://localhost
EXPO_PUBLIC_SUPABASE_PROJECT_URL=https://allbizkxjccwarsftcrq.supabase.co
EXPO_PUBLIC_SUPABASE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbGJpemt4amNjd2Fyc2Z0Y3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNTMzMTcsImV4cCI6MjA0MzYyOTMxN30.I-4Z7pZXQRYiaDeV8q5qFcP9WgEOX7L8gU4GAO1bKb4
</code></pre>

<h4>Backend Setup (C# .NET ASP.NET)</h4>
<p>The backend is built using .NET 8 SDK and runs on port 4000.</p>
<ol>
  <li>Navigate to the backend directory:
    <pre><code>cd server</code></pre>
  </li>
  <li>Create a <code>.env</code> file in the <code>server/</code> directory with the following configuration:
    <pre><code>GOOGLE_CLIENT_SECRET=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
GOOGLE_CLIENT_ID=843265692538-rjf3cnn9ocva0tbu79n1dfhjd3g11nr3.apps.googleusercontent.com
</code></pre>
  </li>
  <li>Start the backend server:
    <pre><code>dotnet run</code></pre>
  </li>
</ol>

<hr />

<h3>Accessing the Services</h3>
<ul>
  <li>Frontend: <a href="http://localhost:8080" target="_blank">http://localhost:8081</a></li>
  <li>Backend: <a href="http://localhost:4000" target="_blank">http://localhost:4000</a></li>
</ul>

<p>By following these steps, you will have Farmify running locally. If you encounter any issues, ensure the required dependencies are installed, and refer to the Docker setup for a simplified workflow.</p>




## Environment Variables

| Variable                                  | Description                                      |
|-------------------------------------------|--------------------------------------------------|
| `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`     | Secret key for Google OAuth                     |
| `843265692538-rjf3cnn9ocva0tbu79n1dfhjd3g11nr3.apps.googleusercontent.com` | Client ID for Google OAuth                     |
| `EXPO_PUBLIC_BACKEND_URL`                 | Backend URL for API calls (default: `http://localhost:4000`) |
| `EXPO_PUBLIC_REACT_NATIVE_FRONTEND_URL`   | Frontend URL for development (default: `https://localhost`) |
| `EXPO_PUBLIC_SUPABASE_PROJECT_URL`        | Supabase project URL (`https://allbizkxjccwarsftcrq.supabase.co`) |
| `EXPO_PUBLIC_SUPABASE_API_KEY`            | Supabase API Key                                |
|                                           | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbGJpemt4amNjd2Fyc2Z0Y3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNTMzMTcsImV4cCI6MjA0MzYyOTMxN30.I-4Z7pZXQRYiaDeV8q5qFcP9WgEOX7L8




## Scrum Nov 12-19


## Simeon:
-Adjusted db schema including:
  1. Merging Auction and Product tables
  2. Adding start/end price+time to bid
  3. Added imageURL col to Product table
  4. FK from bid referencing new Product table
  5. Trigger to decrement Product amount when a purchase is made


# Adi:
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

# Adi

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
  


## Scrum Nov 31 - Dec 6

# Adi 

1. Added docker support to simplify setup process. To start run: 'docker compose up' in Farmify directory and both client and server will start up on port 8081 (client) and port 400 (server) respectively.
2. Built PhotoUpload functionality to work on WebView when user uploads profile picture
3. Re-designed header of auctions page to make profile pictures and header text larger and centered.
4. Redesigned `Readme.md` to include more detailed instructions on how to setup, endpoint descriptions, scrum updates,  pictures of the app working
5. Added currency formatting for startPrice and endPrice through use of new utility function in newlisting.tsx
6. Added scrollbar on product detail  and checkout pages to scroll past long descriptions and have access to submit buttons


##