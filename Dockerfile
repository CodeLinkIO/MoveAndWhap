# Select the base image
FROM node:14

RUN apt-get update && apt-get install -y jq

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variables if necessary
# RUN export CONTRACT_ADDRESS=$(npx hardhat run --network local_subnet ./contracts/scripts/deployer.js | jq ".MAW.address");echo $CONTRACT_ADDRESS >> .env;

# Expose the port your Node.js application listens on
EXPOSE 7070

# Specify the command to run your Node.js application
CMD ["node", "./examples/mawServer.mjs"]
