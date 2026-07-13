# Web Sekolah MIN 5 Tulungagung - Deployment & Installation Guide

This document provides a comprehensive guide to installing, configuring, and deploying the Web Sekolah application, which consists of a Laravel 12 backend and a React (Vite) frontend.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Installation (Development)](#local-installation-development)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
3. [Deployment Guide (Production)](#deployment-guide-production)
   - [Backend Deployment (Laravel)](#backend-deployment-laravel)
   - [Frontend Deployment (React/Vite)](#frontend-deployment-reactvite)
4. [Performance & Responsive Optimizations](#performance--responsive-optimizations)

---

## Prerequisites

Before you begin, ensure your server or local machine meets the following requirements:
- **PHP**: ^8.2 (Required for Laravel 12)
- **Composer**: ^2.0
- **Node.js**: ^18.x or ^20.x
- **NPM** or **Yarn** or **pnpm**
- **Database**: MySQL 8.0+, PostgreSQL 12+, or SQLite (for local dev)
- **Web Server**: Nginx or Apache (for production deployment)

---

## Local Installation (Development)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd min5TA
```

### 2. Backend Setup
Navigate to the `backend` directory and set up the Laravel application:
```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in the .env file
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=min5ta_db
# DB_USERNAME=root
# DB_PASSWORD=

# Run database migrations and seeders (if any)
php artisan migrate --seed

# Link storage (for uploaded files)
php artisan storage:link

# Start the local development server
php artisan serve
```

### 3. Frontend Setup
Open a new terminal window, navigate to the `frontend` directory, and set up the React application:
```bash
cd frontend

# Install JavaScript dependencies
npm install

# Copy environment file
cp .env.example .env

# Ensure your .env points to the backend API URL
# VITE_API_URL=http://localhost:8000/api
# VITE_STORAGE_URL=http://localhost:8000/storage

# Start the Vite development server
npm run dev
```

---

## Deployment Guide (Production)

### 1. Backend Deployment (Laravel)

**A. Server Configuration:**
- Ensure your server has PHP 8.2+, Composer, and a Web Server (Nginx recommended).
- Configure your web server document root to point to the `backend/public` directory.

**B. Deployment Steps:**
```bash
cd /path/to/your/server/backend

# Pull latest code
git pull origin main

# Install dependencies optimized for production
composer install --optimize-autoloader --no-dev

# Ensure permissions are correct
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Run migrations (ensure you backup database first if needed)
php artisan migrate --force

# Optimize application
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**C. Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    root /path/to/your/server/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 2. Frontend Deployment (React/Vite)

**A. Build for Production:**
Navigate to the `frontend` directory on your local machine or build server:
```bash
cd frontend

# Install dependencies
npm install

# Create production build
npm run build
```
This will generate a `dist` folder containing the compiled static assets.

**B. Server Deployment:**
- Upload the contents of the `dist` folder to your web server's document root for the frontend.
- Since this is a SPA (Single Page Application), ensure your web server rewrites all requests to `index.html`.

**C. Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/your/server/frontend/dist;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. Continuous Deployment (Auto Deploy via GitHub Actions)

Anda bisa mengotomatisasi proses deployment ke server setiap kali ada *push* atau *merge* ke branch `main` menggunakan GitHub Actions.

**A. Konfigurasi Secrets di GitHub:**
1. Buka repository Anda di GitHub: `https://github.com/Faishol7415/web-sekolah-MIN5TA`
2. Masuk ke tab **Settings** > **Secrets and variables** > **Actions**.
3. Tambahkan 4 buah *New repository secret* berikut:
   - `SERVER_HOST`: IP Address atau Domain server Anda (contoh: `192.168.1.1` atau `api.domain.com`)
   - `SERVER_USER`: Username SSH untuk login ke server (contoh: `root` atau `ubuntu`)
   - `SERVER_PORT`: Port SSH (biasanya `22`)
   - `SERVER_SSH_KEY`: Private Key SSH yang memiliki akses ke server Anda (berasal dari file `~/.ssh/id_rsa`). Pastikan Public Key dari key ini sudah ditambahkan ke `~/.ssh/authorized_keys` di server.

**B. File Workflow:**
File workflow deployment sudah disiapkan di dalam repository pada path:
[`/.github/workflows/deploy.yml`](file:///d:/coding%20test/min5TA/.github/workflows/deploy.yml)

**C. Cara Kerja:**
Setiap kali Anda menjalankan perintah `git push origin main`, GitHub Actions akan:
1. Membaca file `.github/workflows/deploy.yml`.
2. Melakukan SSH ke server produksi Anda menggunakan data dari Secrets.
3. Menjalankan perintah `git pull origin main` secara otomatis di direktori server.
4. Menjalankan `composer install` & `php artisan migrate` untuk Backend.
5. Menjalankan `npm install` & `npm run build` untuk Frontend.

*Catatan: Pastikan Anda telah melakukan "Clone" proyek ini secara manual pertama kali di server (seperti pada langkah "Deployment Guide" sebelumnya), dan pastikan letak direktori proyek sesuai dengan script `cd /path/to/your/server/project/min5TA` di dalam file `deploy.yml`.*

### 4. Deployment ke Shared Hosting (cPanel)

Jika Anda tidak menggunakan VPS melainkan menggunakan **Shared Hosting (cPanel)**, pendekatannya sedikit berbeda karena Anda tidak bisa menjalankan perintah terminal leluasa atau Node.js untuk frontend di server.

**A. Deploy Backend (Laravel):**
1. Di komputer lokal Anda, buka terminal di folder `backend`. Jalankan `composer install --optimize-autoloader --no-dev`.
2. Hapus (atau jangan sertakan) folder `node_modules` jika ada.
3. Zip seluruh isi folder `backend`.
4. Di **cPanel File Manager**, buat folder baru **di luar** `public_html` (misal: `min5ta_backend`). Upload dan ekstrak file Zip ke folder ini.
5. Masuk ke folder `min5ta_backend/public`, pindahkan **semua isinya** (termasuk `index.php` dan `.htaccess`) ke dalam folder tempat API akan diakses (misalnya subdomain `api.domain.com` atau di dalam folder `public_html/api`).
6. Buka file `index.php` yang baru saja dipindahkan, lalu ubah 2 baris path ini agar mengarah ke lokasi folder `min5ta_backend` yang benar:
   ```php
   // Ubah:
   require __DIR__.'/../vendor/autoload.php';
   // Menjadi (sesuaikan dengan jumlah mundur direktorinya):
   require __DIR__.'/../../min5ta_backend/vendor/autoload.php';

   // Ubah:
   $app = require_once __DIR__.'/../bootstrap/app.php';
   // Menjadi:
   $app = require_once __DIR__.'/../../min5ta_backend/bootstrap/app.php';
   ```
7. Jangan lupa edit file `.env` di `min5ta_backend` dengan koneksi database MySQL dari cPanel Anda.

**B. Deploy Frontend (React/Vite):**
1. Di komputer lokal, pastikan file `.env` di folder `frontend` sudah mengarah ke URL API hosting Anda (misal `VITE_API_URL=https://api.domain.com/api`).
2. Buka terminal di folder `frontend`, jalankan `npm run build`.
3. Akan muncul folder bernama `dist`. Zip **seluruh isi (file dan foldernya)** di dalam folder `dist` tersebut.
4. Di **cPanel File Manager**, upload dan ekstrak file Zip tersebut ke dalam folder domain utama Anda (misal: `public_html`).
5. **Penting:** Karena ini aplikasi React SPA, Anda wajib membuat/mengedit file `.htaccess` di dalam `public_html` agar saat halaman di-refresh, tidak terjadi error "404 Not Found". Tambahkan kode berikut di `.htaccess`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## Performance & Responsive Optimizations

During Phase 6 (Polish & Deploy), the following optimizations have been implemented:

1. **Lazy Loading Routes (Code Splitting):**
   - React router pages are now dynamically imported using `React.lazy()` and `<Suspense>`.
   - This drastically reduces the initial JavaScript bundle size, speeding up the First Contentful Paint (FCP) and Time to Interactive (TTI).

2. **Tailwind CSS Optimization:**
   - Leveraging Tailwind v4 with the Vite plugin which provides incredibly fast, on-demand CSS generation, resulting in a minimal CSS footprint.

3. **Responsive Design:**
   - The application has been fully tested using Tailwind's responsive utilities (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) to ensure optimal viewing across all device screens (Mobile, Tablet, Desktop).
