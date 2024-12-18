# Use a Node.js base image
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY ./app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY ./app .

# Build the React app
RUN npm run build

# Use a smaller base image for production
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build /app/build /app

# Expose the port that the React app will run on
EXPOSE 3000

# Start the React app

CMD ["npm", "start", "--prefix", "/app/app"]
# CMD ["tail", "-f", "/dev/null"]