# DOCKER-VERSION 1.0.1
FROM node:0.10.31
EXPOSE 8080

# Bundle app source
COPY . /src
WORKDIR /src

RUN npm install --unsafe-perm
CMD node bin/cluster
