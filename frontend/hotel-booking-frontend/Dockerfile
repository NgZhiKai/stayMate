# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the frontend code
COPY . .

# Expose the port that the app runs on
EXPOSE 5173

# Define the command to run the app
CMD ["npm", "start"]
