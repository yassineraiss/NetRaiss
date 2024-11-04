FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Start the Vite dev server in development mode
CMD ["npm", "run", "dev", "--", "--host"]