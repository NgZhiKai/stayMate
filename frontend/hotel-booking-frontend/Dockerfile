# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the frontend application
RUN npm run build

# Expose the port that the app runs on
EXPOSE 5173

# Serve the build output (dist folder) with a simple static file server
RUN npm install -g serve

# Define the command to run the app, serving the build files
CMD ["serve", "-s", "dist", "-l", "5173"]