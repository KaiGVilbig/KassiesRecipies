# Use the official Node.js 22.12.0 image for ARM architecture
FROM arm32v7/node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install --no-optional

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000 for the app
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
