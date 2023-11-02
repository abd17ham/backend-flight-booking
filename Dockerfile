
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=8000
ENV MONGO_URL=mongodb+srv://gokulmylsami:gokul123@cluster0.gezhqed.mongodb.net/avesair
ENV JWT_SECRET=avesair123432
ENV JWT_EXPIRES_IN = 1d

ENV EMAIL_SERVICE=gmail
ENV EMAIL_USERNAME=sakthimuruganricemill@gmail.com
ENV EMAIL_PASSWORD=pfxhnmdpjhmqkcsi
ENV FRONTEND_URL=localhost:3000

EXPOSE 8000


CMD ["npm", "start"]
