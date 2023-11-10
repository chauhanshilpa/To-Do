FROM node:slim
WORKDIR /api
COPY /api /api
RUN npm install
EXPOSE 4002
CMD node index.js