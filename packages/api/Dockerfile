FROM node:16-alpine

WORKDIR /usr/src/api
COPY . .

RUN npm config set update-notifier false
RUN npm ci --quiet --no-audit --no-fund
RUN npm run build
RUN npm prune --production --quiet --no-audit --no-fund
RUN npm install --quiet --no-audit --no-fund -g clean-modules@2.0.4 && \
      clean-modules -y

FROM node:16-alpine
RUN apk add --no-cache dumb-init
USER node
ENV NODE_ENV production
WORKDIR /usr/src/api
COPY --chown=node:node --from=0 /usr/src/api/node_modules /usr/src/api/node_modules
COPY --chown=node:node --from=0 /usr/src/api/dist /usr/src/api/dist
COPY --chown=node:node --from=0 /usr/src/api/package.json /usr/src/api/package.json
CMD ["dumb-init", "node", "dist/index.js"]
