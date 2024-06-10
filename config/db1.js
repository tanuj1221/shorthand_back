const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Tatya313912',
    database: 'demo1',
    waitForConnections: true,
    connectionLimit: 100000,
    queueLimit: 0 // Added database name
  });

module.exports = connection