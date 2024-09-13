# Use the official Node.js image as the base
FROM node:20-slim

# Install dependencies like poppler-utils
RUN apt-get update && apt-get install -y poppler-utils

# Set the working directory
WORKDIR /usr/src/app

# Copy the application files to the container
COPY . .

# Install the Node.js dependencies
RUN npm install

# Specify the command to run your application
CMD ["npm","run","dev"]
