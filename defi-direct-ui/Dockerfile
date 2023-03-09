FROM node:8.11.1 as builder
RUN mkdir /defi-direct-ui
WORKDIR /defi-direct-ui
COPY src ./src
COPY package.json .
COPY public ./public

RUN npm install --quiet
RUN npm run build

# Copy built app into nginx container
FROM nginx:1.13.5
COPY --from=builder /defi-direct-ui/build /usr/share/nginx/html

EXPOSE 80