# Use lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from current dir into the container
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
