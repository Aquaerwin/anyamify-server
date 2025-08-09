import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3200;

app.use(cors());
app.use('/images', express.static('fotoProduk'));

// Fungsi untuk membaca data dari file JSON
const getData = (path) => {
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
};

// Fungsi untuk mencari data produk berdasarkan ID
const findDataById = (id) => {
    const dataProduct = getData('./data/Product.json');
    const findProduct = dataProduct.find((data) => data.id === parseInt(id));
    return findProduct;
};


// --- Route Utama (Halaman Awal) ---
// Diletakkan di sini, sebelum route API lainnya.
app.get('/', (req, res) => {
    res.send('<h1>Selamat Datang di API Anyamify!</h1><p>Server berjalan dengan baik. Coba akses /product.</p>');
});


// --- Routes API Anda ---
app.get('/banner', (req, res) => {
    const data = getData('./data/Banner.json');
    res.json(data);
});

app.get('/product', (req, res) => {
    const data = getData('./data/Product.json');
    res.json(data);
});

app.get('/product/:id', (req, res) => {
    const product = findDataById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({
            id: 999,
            brand: "PRODUK TIDAK DITEMUKAN",
            price: 0,
            image: "/images/not_found_placeholder.jpg"
        });
    }
});


app.listen(port, () => {
    console.log(`Server sudah berjalan di port : ${port}`);
});