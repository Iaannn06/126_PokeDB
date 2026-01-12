const mysql = require('mysql2');

require('dotenv').config(); 

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});


pool.promise().getConnection()
    .then(conn => {
        console.log('✅ Database connected successfully.');
        conn.release(); 
    })
    .catch(err => {
        console.error('❌ Error connecting to the database:', err.message);
    });

// Export versi promise-nya biar bisa dipake di controller dengan async/await
module.exports = pool.promise();