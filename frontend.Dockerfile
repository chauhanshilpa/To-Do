FROM node:slim
WORKDIR /app
COPY /app /app
RUN npm install
EXPOSE 3000
RUN npm run build
CMD npm start