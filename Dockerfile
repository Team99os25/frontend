# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build the app (if needed for production)
RUN npm run build

# Expose the port (adjust as needed based on your frontend framework)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
