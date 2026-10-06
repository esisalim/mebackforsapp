FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# باز گذاشتن پورت‌های رایج
EXPOSE 7860 8080
CMD ["npm", "start"]
