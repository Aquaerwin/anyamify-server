import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser'; // <-- Impor baru
import bcrypt from 'bcryptjs';         // <-- Impor baru
import jwt from 'jsonwebtoken';      // <-- Impor baru

const app = express();
const port = process.env.PORT || 3200;
const SECRET_KEY = 'kunci-rahasia-super-aman-milikmu-12345'; // <-- Ganti dengan kunci rahasia Anda

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json()); // <-- Middleware untuk membaca body JSON dari request
app.use('/images', express.static('fotoProduk'));

// --- Fungsi Helper ---
const getData = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));
const saveData = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

// --- Route Utama (Halaman Awal) ---
app.get('/', (req, res) => {
    res.send('<h1>Selamat Datang di API Anyamify!</h1><p>Server berjalan dengan baik.</p>');
});

// --- Routes API Anda (TIDAK BERUBAH) ---
app.get('/banner', (req, res) => {
    const bannerData = getData('./data/Banner.json');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const responseData = bannerData.map(item => ({ ...item, image: `${baseUrl}/images/${item.image}` }));
    res.json(responseData);
});
app.get('/product', (req, res) => {
    const productData = getData('./data/Product.json');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const responseData = productData.map(item => ({ ...item, image: `${baseUrl}/images/${item.image}` }));
    res.json(responseData);
});
app.get('/recommendation', (req, res) => {
    const allRecommendations = getData('./data/Recommendation.json');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const shuffled = [...allRecommendations].sort(() => 0.5 - Math.random());
    const randomTwo = shuffled.slice(0, 2);
    const responseData = randomTwo.map(item => ({ ...item, image: `${baseUrl}/images/${item.image}` }));
    res.json(responseData);
});
app.get('/product/:id', (req, res) => {
    const dataProduct = getData('./data/Product.json');
    const product = dataProduct.find((data) => data.id === parseInt(req.params.id));
    if (product) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const responseData = { ...product, image: `${baseUrl}/images/${product.image}` };
        res.json(responseData);
    } else {
        res.status(404).json({ id: 999, brand: "PRODUK TIDAK DITEMUKAN", price: 0, image: "" });
    }
});

// --- ENDPOINT BARU UNTUK AUTENTIKASI ---
app.post('/api/register', (req, res) => {
    const users = getData('./data/users.json');
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ message: "Semua field harus diisi" });
    if (users.find(user => user.email === email)) return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { id: Date.now(), name, email, password: hashedPassword };

    users.push(newUser);
    saveData('./data/users.json', users);
    res.status(201).json({ message: "Pendaftaran berhasil!" });
});

app.post('/api/login', (req, res) => {
    const users = getData('./data/users.json');
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: "Email tidak ditemukan" });

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ message: "Login berhasil!", token });
});
// --- AKHIR ENDPOINT BARU ---

app.listen(port, () => {
    console.log(`Server sudah berjalan di port : ${port}`);
});