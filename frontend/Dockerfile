# ----------------------------
# Stage 1: Build React (Vite)
# ----------------------------
FROM node:18 AS build

WORKDIR /app

# Copy dependency files first for caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build production without source maps
ENV GENERATE_SOURCEMAP=false
RUN npm run build

# ----------------------------
# Stage 2: Serve with Nginx
# ----------------------------
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
