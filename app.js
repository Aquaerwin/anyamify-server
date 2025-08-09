import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3200;

app.use(cors());
app.use('/images', express.static('fotoProduk'));

// --- Fungsi Helper ---
const getData = (path) => {
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
};

// --- Route Utama (Halaman Awal) ---
app.get('/', (req, res) => {
    res.send('<h1>Selamat Datang di API Anyamify!</h1><p>Server berjalan dengan baik.</p>');
});


// --- Routes API Anda ---

// Route untuk Banner (SUDAH DIPERBAIKI)
app.get('/banner', (req, res) => {
    const bannerData = getData('./data/Banner.json');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const responseData = bannerData.map(item => ({
        ...item,
        image: `${baseUrl}/images/${item.image}`
    }));
    res.json(responseData);
});

// Route untuk semua Produk (SUDAH DIPERBAIKI)
app.get('/product', (req, res) => {
    const productData = getData('./data/Product.json');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const responseData = productData.map(item => ({
        ...item,
        image: `${baseUrl}/images/${item.image}`
    }));
    res.json(responseData);
});

// Route untuk satu Produk berdasarkan ID (SUDAH DIPERBAIKI)
app.get('/product/:id', (req, res) => {
    const dataProduct = getData('./data/Product.json');
    const product = dataProduct.find((data) => data.id === parseInt(req.params.id));

    if (product) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const responseData = {
            ...product,
            image: `${baseUrl}/images/${product.image}`
        };
        res.json(responseData);
    } else {
        res.status(404).json({
            id: 999,
            brand: "PRODUK TIDAK DITEMUKAN",
            price: 0,
            image: ""
        });
    }
});


app.listen(port, () => {
    console.log(`Server sudah berjalan di port : ${port}`);
});
