FROM node:18

# Install watchman (for Metro)
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    build-essential \
    watchman \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile || npm install

COPY . .

EXPOSE 8081

CMD ["npx", "react-native", "start"] 