FROM node:lts-alpine AS builder

WORKDIR /app
COPY . .
RUN corepack enable pnpm && pnpm install && pnpm build

FROM node:lts-alpine

WORKDIR /app
COPY package.json .
COPY --from=builder /app/dist .

RUN npm install --production

CMD [ "node", "/app/index.js" ]
