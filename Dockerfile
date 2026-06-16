FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm run build:server && npm run build:cli

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/bin ./bin
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/server.js ./
COPY --from=builder /app/config.js ./
COPY --from=builder /app/ui/dist ./ui/dist
COPY --from=builder /app/vendor ./vendor
COPY --from=builder /app/assets ./assets

RUN npm install -g pg

EXPOSE 8020

CMD ["node", "bin/ima2.js", "serve", "--host", "0.0.0.0", "--port", "8020"]
