# Use the official Node.js 22 image
FROM node:22-slim

# Set the working directory inside the container
WORKDIR /app

# Copy necessary files to the container
COPY package*.json ./
COPY .next ./.next
COPY public ./public
COPY uploads ./uploads

# Install production dependencies
RUN npm install --production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
