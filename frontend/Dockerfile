# Stage 1: Build the app for production
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies ignoring peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

# Install serve to serve the build folder
RUN npm install -g serve

# Copy build from previous stage
COPY --from=build /app/dist ./dist

# Expose port 8080 for production
EXPOSE 4020

# Serve production build
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4020"]
