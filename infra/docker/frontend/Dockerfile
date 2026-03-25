FROM node:22-alpine

WORKDIR /app/frontend

COPY frontend/package.json ./package.json
COPY frontend/angular.json ./angular.json
COPY frontend/tsconfig.json ./tsconfig.json
COPY frontend/tsconfig.app.json ./tsconfig.app.json
RUN npm install

EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]
