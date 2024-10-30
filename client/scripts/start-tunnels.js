const { spawn } = require("child_process");
const fs = require("fs");

// Clear .env file at the start
fs.writeFileSync(".env", "");

// Start frontend tunnel
const frontend = spawn("cloudflared", [
  "tunnel",
  "--url",
  "http://localhost:8081"
]);

// Start backend tunnel
const backend = spawn("cloudflared", [
  "tunnel",
  "--url",
  "http://localhost:4000"
]);

const printURL = (data, type) => {
  const urlMatch = data.toString().match(/https:\/\/[^\s]+/);
  if (urlMatch) {
    const url = urlMatch[0];

    // Filter out unwanted URLs (only keep URLs with "trycloudflare.com")
    if (!url.includes("trycloudflare.com")) {
      console.log(`Ignoring non-tunnel URL: ${url}`);
      return;
    }

    console.log(`${type} URL: ${url}`);

    // Write the frontend and backend URLs, overwriting each time
    if (type === "Backend") {
      fs.appendFileSync(".env", `EXPO_PUBLIC_REACT_NATIVE_BACKEND_URL=${url}\n`);
    }

    if (type === "Frontend") {
      fs.appendFileSync(".env", `EXPO_PUBLIC_REACT_NATIVE_FRONTEND_URL=${url}\n`);
    }
  }
}

// Listen for URLs in stderr instead of stdout
frontend.stderr.on("data", (data) => printURL(data, "Frontend"));
backend.stderr.on("data", (data) => printURL(data, "Backend"));

// Error handling
frontend.stderr.on("data", (data) => console.error(`Frontend error: ${data}`));
backend.stderr.on("data", (data) => console.error(`Backend error: ${data}`));
