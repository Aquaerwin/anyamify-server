import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
// Perubahan 1: Menggunakan port dari hosting, atau 3200 jika dijalankan lokal
const port = process.env.PORT || 3200;

app.use(cors());

// Perubahan 2: Membuat folder 'fotoProduk' bisa diakses melalui URL '/images'
app.use('/images', express.static('fotoProduk'));


// Fungsi untuk membaca data dari file JSON (sudah diperbaiki)
const getData = (path) => {
    // Perubahan 3: readFileSync adalah synchronous dan tidak butuh callback
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
};

// Fungsi untuk mencari data produk berdasarkan ID
const findDataById = (id) => {
    const dataProduct = getData('./data/Product.json');
    // Mencari produk, pastikan ID dibandingkan sebagai tipe data yang sama (angka)
    const findProduct = dataProduct.find((data) => data.id === parseInt(id));
    return findProduct; // Mengembalikan produk atau undefined jika tidak ditemukan
};


// Routes API Anda
app.get('/banner', (req, res) => {
    const data = getData('./data/Banner.json');
    res.json(data);
});

app.get('/category', (req, res) => {
    const data = getData('./data/Category.json');
    res.json(data);
});

app.get('/product', (req, res) => {
    const data = getData('./data/Product.json');
    res.json(data);
});

app.get('/product/:id', (req, res) => {
    const product = findDataById(req.params.id);

    if (product) {
        // Jika produk ditemukan, kirim produknya
        res.json(product);
    } else {
        // Perubahan 4: Jika tidak ditemukan, kirim object "not found"
        // URL gambar tidak lagi di-hardcode ke localhost
        res.status(404).json({
            id: 999,
            brand: "PRODUK TIDAK DITEMUKAN",
            price: 0,
            image: "/images/not_found_placeholder.jpg" // Contoh path gambar placeholder
        });
    }
});


app.listen(port, () => {
    console.log(`Server sudah berjalan di port : ${port}`);
});