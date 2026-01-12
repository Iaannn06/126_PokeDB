const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.PORT,
    waitForConnections: true,
    connectionLimit: 10,
});

pool.getConnection()
    .then(conn => {
        console.log('Database connected successfully.');
        conn.release(); 
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

module.exports = pool.promise();