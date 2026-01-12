const db = require('../config/database');

const validateApiKey = async (apiKey) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ message: 'Akses Ditolak, API Key tidak ditemukan.' });
    }

    
}