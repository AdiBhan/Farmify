FROM node:18-slim
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port for Expo
EXPOSE 8081

# Start using the local Expo CLI
CMD ["npx", "expo", "start", "--web", "--port", "8081"]
