const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
    const { email, password, company_name } = req.body;
    if (!email || !password || !company_name) return res.status(400).json({ error: "Data tidak lengkap!" });

    try {
        const [exist] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (exist.length > 0) return res.status(400).json({ error: "Email sudah terdaftar!" });

        await db.query('INSERT INTO users (email, password, company_name) VALUES (?, ?, ?)', [email, password, company_name]);
        res.json({ status: 'success', message: 'Registrasi Berhasil! Silakan Login.' });
    } catch (error) {
        res.status(500).json(error);
    }
};