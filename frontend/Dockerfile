# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

# Expose the development server port (default for Vite is 5173, CRA is 3000)
EXPOSE 4021

# Run the development server
CMD ["npm", "run", "dev", "--", "--host"]
