require('dotenv').config(); 
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // <--- INI PENTING (Baca port 3309 dari .env)
    waitForConnections: true,
    connectionLimit: 10
});

pool.promise().getConnection()
    .then(conn => {
        console.log(`✅ Terhubung ke Database: ${process.env.DB_NAME} di Port ${process.env.DB_PORT}`);
        conn.release();
    })
    .catch(err => {
        console.error("❌ Gagal Konek Database. Pastikan Password Benar!");
        console.error("Detail Error:", err.message);
    });

module.exports = pool.promise();