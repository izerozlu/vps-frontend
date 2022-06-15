FROM node:14.19.1-alpine

RUN mkdir -p /usr/src/vps-frontend
WORKDIR /usr/src/vps-frontend
COPY . .

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000 

ENTRYPOINT ["npm", "start"]