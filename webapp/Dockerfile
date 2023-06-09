# Base image
FROM node:14 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if using npm)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy the entire project
COPY . .

# Build the production-ready app
RUN yarn build

# Stage 2: Serve the production-ready app using a lightweight web server
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
