FROM node:slim
RUN apt-get update && \
    apt-get install -y curl
WORKDIR /api
COPY /api /api
RUN npm install
EXPOSE 4002
CMD node index.js