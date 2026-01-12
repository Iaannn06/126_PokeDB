const db = require('../config/db');

const validateApiKey = async (req, res, next) => {
    // Ambil API Key dari header
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ message: 'Akses Ditolak, API Key tidak ditemukan.' });
    }

    try {
        // Cek ke database apakah key ada dan aktif
        const [rows] = await db.query('SELECT * FROM api_keys WHERE key_string = ? AND is_active = 1', [apiKey]);
        
        if (rows.length > 0) {
            // Valid! Lanjut ke controller
            next(); 
        } else {
            // Tidak valid
            res.status(403).json({ error: "API Key tidak valid." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error saat validasi key." });
    }
}

module.exports = validateApiKey;