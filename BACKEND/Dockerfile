# 1️⃣ Use official Node.js LTS image
FROM node:18-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package files first (cache layer)
COPY package.json package-lock.json ./

# 4️⃣ Install ALL dependencies (safe & deterministic)
RUN npm ci

# 5️⃣ Copy application source
COPY . .

# 6️⃣ Expose backend port
EXPOSE 5000

# 7️⃣ Start the app
CMD ["node", "index.js"]

