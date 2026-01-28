# ---------- BUILD STAGE ----------
FROM node:18-alpine AS build

WORKDIR /app

# Accept build-time env variable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Vite app
RUN npm run build

# ---------- NGINX STAGE ----------
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

