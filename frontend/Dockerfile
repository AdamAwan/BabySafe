# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean cache to avoid issues
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copy source code
COPY . .

# Create production build with environment variables properly set
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a simple healthcheck endpoint
RUN echo "location /health { return 200 'healthy'; }" > /etc/nginx/conf.d/health.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 