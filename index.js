const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();


const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// Koneksi ke database MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi ke database gagal:', err);
        return;
    }
    console.log('Koneksi ke database berhasil.');
});

// API CRUD

// Create (Membuat data baru)
app.post('/api/items', (req, res) => {
    const { name, price } = req.body;
    const sql = 'INSERT INTO items (name, price) VALUES (?, ?)';
    db.query(sql, [name, price], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, name, price });
        console.log('data berhasil ditambah');
    });
});

// Read (Mendapatkan semua data)
app.get('/api/items', (req, res) => {
    const sql = 'SELECT * FROM items';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
        console.log('data dimbil');
    });
});

// Read (Mendapatkan data berdasarkan ID)
app.get('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM items WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
        console.log('data berasil diambil');
    });
});

// Update (Memperbarui data berdasarkan ID)
app.put('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    const sql = 'UPDATE items SET name = ?, price = ? WHERE id = ?';
    db.query(sql, [name, price, id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Data berhasil diperbarui' });
        console.log('data berasil diupdate');
    });
});

// Delete (Menghapus data berdasarkan ID)
app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM items WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Data berhasil dihapus' });
        console.log('data dengan id '+ id +' berasil dihapus');
    });
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
