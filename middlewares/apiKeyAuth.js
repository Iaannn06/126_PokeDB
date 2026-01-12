const db = require('../config/database');

const validateApiKey = async (apiKey) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ message: 'Akses Ditolak, API Key tidak ditemukan.' });
    }

    try {
       const [rows] = await db.query('SELECT * FROM api_keys WHERE key_string = ? AND is_active = 1', [apiKey]);
        
        if (rows.length > 0) {
            next(); 
        } else {
            res.status(403).json({ error: "API Key tidak valid." });
        }
    }catch (error) {
        res.status(500).json({ error: "Server Error saat validasi key." });
    }


}