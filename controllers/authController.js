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

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            res.json({ status: 'success', token: rows[0].id, name: rows[0].company_name });
        } else {
            res.status(401).json({ error: 'Email atau Password salah' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.generateKey = async (req, res) => {
    const userId = req.body.token;
    const newKey = `pk_${uuidv4().slice(0, 8)}`;
    try {
        await db.query('INSERT INTO api_keys (user_id, key_string) VALUES (?, ?)', [userId, newKey]);
        res.json({ apiKey: newKey });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getMyKey = async (req, res) => {
    const userId = req.query.token;
    try {
        const [rows] = await db.query('SELECT key_string FROM api_keys WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId]);
        res.json(rows[0] || { key_string: null });
    } catch (error) {
        res.status(500).json(error);
    }
};