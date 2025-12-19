<<<<<<< HEAD
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
=======
# =========================
# Stage 1: Build the React app
# =========================
FROM node:18-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install && \
    npm install keycloak-js && \
    npm install --save react-native-get-random-values

COPY frontend/ ./
RUN npm run build

# =========================
# Stage 2: Serve with Nginx (HTTP only)
# =========================
FROM nginx:alpine

# No openssl needed anymore
# RUN apk add --no-cache openssl

# Removed: Self-signed cert generation

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config (must also be HTTP-only)
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Only expose port 80 (HTTP)
EXPOSE 80

>>>>>>> origin/hot-fix/summmary-filter-and-reportgeneration-order
CMD ["nginx", "-g", "daemon off;"]
