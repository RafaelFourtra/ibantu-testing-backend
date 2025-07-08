# Gunakan image resmi Node.js
FROM node:20

# Buat folder kerja di container
WORKDIR /app

# Copy semua file dari folder lokal ke container
COPY . .

# Install dependencies dari package.json
RUN npm install

# Jalankan server ketika container start
CMD ["npm", "start"]

# Aplikasi kamu akan berjalan di port 8080 (Cloud Run default)
EXPOSE 8080
