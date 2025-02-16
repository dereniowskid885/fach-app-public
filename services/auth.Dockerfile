FROM node:lts-alpine
ARG SERVICE_NAME=auth
ARG SERVICE_PATH=apis/${SERVICE_NAME}

ENV NODE_ENV=production
ENV PREFIX=${SERVICE_PATH}

RUN mkdir -p /usr/src/app/${SERVICE_PATH}
WORKDIR /usr/src/app/

COPY ./${SERVICE_PATH}/package.json ./${SERVICE_PATH}/package.json
COPY ./${SERVICE_PATH}/package-lock.json ./${SERVICE_PATH}/package-lock.json
RUN npm install --production --silent --prefix ./${SERVICE_PATH}

COPY ./${SERVICE_PATH}/ ./${SERVICE_PATH}
COPY ./helpers ./helpers
COPY ./middlewares ./middlewares
COPY ./constants ./constants
COPY ./alias.config.js ./alias.config.js
COPY ./.env.shared ./.env.shared

EXPOSE 5000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start", "--prefix", "./${PREFIX}"]