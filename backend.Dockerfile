FROM node:slim
WORKDIR /api
COPY /api /api
RUN npm install
CMD node index.js