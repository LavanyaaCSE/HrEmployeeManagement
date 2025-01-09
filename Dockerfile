# Stage 1: Build the frontend
FROM node:18 AS frontend

# Set the working directory for the frontend build
WORKDIR /app

# Copy frontend files
COPY package.json package-lock.json ./
COPY src ./src
COPY public ./public

# Install frontend dependencies
RUN npm install

# Build the frontend
RUN npm run build

# Stage 2: Set up the backend
FROM node:18 AS backend

# Set the working directory for the backend
WORKDIR /app

# Copy the backend files (from /backend)
COPY package.json package-lock.json ./
COPY backend/server.js ./backend/server.js
COPY backend/ ./backend/

# Install backend dependencies
RUN npm install

# Copy the built frontend from the first stage
COPY --from=frontend /app/build /app/build

# Expose the port the backend runs on
EXPOSE 5000

# Start the backend server
CMD ["node", "backend/server.js"]
