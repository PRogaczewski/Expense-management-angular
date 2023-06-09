# Stage 1: Compile and Build angular codebase
# Use official node image as the base image
FROM node:latest as build
# Set the working directory
WORKDIR /app

COPY package*.json /app/
RUN npm install
# Add the source code to app
COPY ./ /app/
# Install all the dependencies
# Generate the build of the application
RUN npm run build
# Stage 2: Serve app with nginx server
# Use official nginx image as the base image
FROM nginx:latest
# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/expenses-ui /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]