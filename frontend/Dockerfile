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

CMD ["nginx", "-g", "daemon off;"]
