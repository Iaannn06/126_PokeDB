const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
    const { email, password, company_name } = req.body;
    if (!email || !password || !company_name) return res.status(400).json({ error: "Data tidak lengkap!" });

    
};