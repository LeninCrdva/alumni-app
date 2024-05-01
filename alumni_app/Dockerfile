FROM node:18.19-alpine AS build
ARG apiURL
ENV apiURL=$apiURL
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install --legacy-peer-deps

COPY . /app
RUN npm run build --prod

#Serve Application using Nginx Server
FROM nginx:alpine
COPY --from=build /app/dist/alumni_app /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf