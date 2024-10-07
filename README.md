# MERN Blog Application

## Deskripsi
Aplikasi blog sederhana yang dibangun menggunakan stack MERN (MongoDB, Express, React, Node.js). Aplikasi ini memungkinkan pengguna untuk membuat dan melihat postingan blog.

## Fitur
- CRUD (Create, Read) untuk postingan blog
- Antarmuka pengguna yang responsif
- Menggunakan MongoDB sebagai database

## Struktur Direktori
```
mern-blog/
│
├── backend/
│   ├── config/
│   │   └── db.js          # Konfigurasi koneksi database
│   ├── controllers/
│   │   └── postController.js  # Kontrol untuk operasi posting
│   ├── models/
│   │   └── postModel.js   # Model untuk postingan blog
│   ├── routes/
│   │   └── postRoutes.js   # Rute API untuk posting
│   ├── server.js           # Server Express
│   └── .env                # Variabel lingkungan
│
├── frontend/
│   ├── public/             # Berkas statis
│   ├── src/
│   │   ├── components/
│   │   │   └── Post.js     # Komponen untuk menampilkan postingan
│   │   ├── pages/
│   │   │   └── Home.js     # Halaman utama untuk menampilkan semua postingan
│   │   ├── App.js          # Komponen utama aplikasi
│   │   ├── index.js        # Entry point untuk React
│   └── package.json        # Konfigurasi package frontend
│
├── README.md               # Dokumentasi proyek
└── package.json            # Konfigurasi package backend
```

## Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/Mohammadiqbalmaulana2001/mern-blog.git
cd mern-blog
```

### 2. Instal Dependencies Backend
```bash
cd backend
npm install
```

### 3. Konfigurasi MongoDB
Buat file `.env` di dalam folder `backend/` dan tambahkan string koneksi MongoDB Anda:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Jalankan Server Backend
```bash
npm run server
```

### 5. Instal Dependencies Frontend
```bash
cd frontend
npm install
```

### 6. Jalankan Aplikasi Frontend
```bash
npm start
```

## Penggunaan
- Akses aplikasi melalui browser di `http://localhost:3000`.
- Anda dapat membuat postingan baru dan melihat daftar postingan yang sudah ada.

## Kontribusi
Jika Anda ingin berkontribusi pada proyek ini, silakan fork repository ini dan buat pull request dengan penjelasan mengenai perubahan yang Anda buat.

## Lisensi
Proyek ini dilisensikan di bawah lisensi MIT.

## Kontak
Jika Anda memiliki pertanyaan, silakan hubungi saya di [Mohammadiqbalmaulana2001](iqbalmaulana99826@gmail.com).
