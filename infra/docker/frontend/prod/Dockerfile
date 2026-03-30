FROM node:22-alpine AS build

WORKDIR /app/frontend

COPY frontend/package.json ./package.json
COPY frontend/angular.json ./angular.json
COPY frontend/tsconfig.json ./tsconfig.json
COPY frontend/tsconfig.app.json ./tsconfig.app.json
COPY frontend/eslint.config.mjs ./eslint.config.mjs
COPY frontend/public ./public
COPY frontend/src ./src
RUN npm install
RUN npm run build

FROM nginx:1.27-alpine

RUN apk add --no-cache gettext

COPY infra/docker/frontend/prod/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY infra/docker/frontend/prod/entrypoint.sh /entrypoint.sh
COPY --from=build /app/frontend/dist/impots-avantages-frontend/browser /usr/share/nginx/html
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
