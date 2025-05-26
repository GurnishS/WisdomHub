# Use the official Node.js image as the base
FROM node:latest

# Install dependencies like poppler-utils
RUN apt-get update && apt-get install -y poppler-utils

# Set the working directory
WORKDIR /usr/src/app

# Copy the application files to the container
COPY . .

# Install the Node.js dependencies
RUN npm install

RUN npm install -g pm2

# Specify the command to run your application
CMD ["pm2", "start", "src/index.js", "--node-args=-r dotenv/config --experimental-json-modules"]
