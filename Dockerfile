FROM keymetrics/pm2:latest-alpine

ENV NPM_CONFIG_LOGLEVEL warn

# Set /app as working directory.
WORKDIR /app

# Expose build args.
ARG NPM_TOKEN
ARG NODE_ENV

# Install app dependencies.
COPY package.json package-lock.json .npmrc* /app/
RUN npm install

# Copy the source code.
COPY src/server /app
COPY src/client/dist /app/dist
COPY health.html /app/dist/

# expose port
EXPOSE 2021

CMD ["pm2-runtime", "process.yml"]
