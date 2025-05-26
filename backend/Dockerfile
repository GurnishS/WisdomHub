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

# Install pm2 globally
RUN npm install -g pm2

# Expose the port your app listens on
EXPOSE 8000

# Specify the command to run your application with pm2 in foreground
CMD ["pm2", "start", "src/index.js", "--node-args=-r dotenv/config --experimental-json-modules", "--no-daemon"]
