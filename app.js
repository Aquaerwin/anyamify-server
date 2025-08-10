// File: App.js (Server)
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser'; // <-- Impor baru
import bcrypt from 'bcryptjs';         // <-- Impor baru
import jwt from 'jsonwebtoken';      // <-- Impor baru

const app = express();
const port = process.env.PORT || 3200;
const SECRET_KEY = 'kunci-rahasia-super-aman-milikmu'; // <-- Ganti dengan kunci rahasia Anda

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json()); // <-- Middleware untuk membaca body JSON dari request
app.use('/images', express.static('fotoProduk'));

// --- Fungsi Helper ---
const getData = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));
const saveData = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

// ... (Route untuk product, banner, dll. tetap sama) ...
app.get('/product', (req, res) => { /* ... kode Anda ... */ });
app.get('/banner', (req, res) => { /* ... kode Anda ... */ });
app.get('/recommendation', (req, res) => { /* ... kode Anda ... */ });
app.get('/product/:id', (req, res) => { /* ... kode Anda ... */ });


// --- ENDPOINT BARU UNTUK AUTENTIKASI ---

// Endpoint Pendaftaran (Sign In)
app.post('/api/register', (req, res) => {
    const users = getData('./data/users.json');
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Semua field harus diisi" });
    }
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { id: Date.now(), name, email, password: hashedPassword };
    
    users.push(newUser);
    saveData('./data/users.json', users);

    res.status(201).json({ message: "Pendaftaran berhasil!" });
});

// Endpoint Login
app.post('/api/login', (req, res) => {
    const users = getData('./data/users.json');
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ message: "Login berhasil!", token });
});


app.listen(port, () => {
    console.log(`Server sudah berjalan di port : ${port}`);
});
