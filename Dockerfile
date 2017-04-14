FROM node:6.9.4

RUN npm install pm2 -g

WORKDIR ./world-of-rations-service

COPY ./dist ./
RUN npm install --only=production

CMD ["pm2-docker", "./app.js"]