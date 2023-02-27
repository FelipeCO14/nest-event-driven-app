FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN pnpm --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/billing/main"]