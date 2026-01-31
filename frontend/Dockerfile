################### Stage 1 – build React ###################
FROM node:18-alpine AS builder
WORKDIR /src

# Accept the backend URL at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Package files for dependency cache
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

################### Stage 2 – serve with NGINX ##############
FROM nginx:alpine

COPY nginx-spa.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /src/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
