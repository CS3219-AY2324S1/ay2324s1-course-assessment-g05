FROM node:20

ENV NODE_ENV=development

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Copy .env 
COPY .env .env

# Build the project
RUN npm run build

ARG PORT=5200

EXPOSE $PORT

CMD ["node", "dist/app.js"]