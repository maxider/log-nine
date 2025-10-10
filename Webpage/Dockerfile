FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build argument for backend URL
ARG VITE_APP_BACKEND_URL=http://localhost:8082
ENV VITE_APP_BACKEND_URL=${VITE_APP_BACKEND_URL}

# Build the app
RUN npm run build

EXPOSE 4173

# Run preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]