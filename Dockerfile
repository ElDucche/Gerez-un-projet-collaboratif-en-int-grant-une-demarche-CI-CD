# Multi-stage build for BobApp (Frontend + Backend)

# Stage 1: Build Backend
FROM maven:3.6.3-jdk-11-slim AS backend-build
RUN mkdir -p /workspace
WORKDIR /workspace
COPY back/pom.xml /workspace/
COPY back/src /workspace/src
RUN mvn -B -f pom.xml clean package -DskipTests

# Stage 2: Build Frontend
FROM node:16-alpine AS frontend-build
WORKDIR /usr/local/app
COPY front/package*.json ./
RUN npm ci
COPY front/ ./
RUN npm run build

# Stage 3: Final application image
FROM nginx:alpine AS production

# Install Java runtime for backend
RUN apk add --no-cache openjdk11-jre

# Create application directory
RUN mkdir -p /app/backend /app/frontend

# Copy backend JAR
COPY --from=backend-build /workspace/target/*.jar /app/backend/app.jar

# Copy frontend build
COPY --from=frontend-build /usr/local/app/dist/bobapp /app/frontend/

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy startup script
COPY docker/startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh

# Expose ports
EXPOSE 80 8080

# Start both services
CMD ["/app/startup.sh"]