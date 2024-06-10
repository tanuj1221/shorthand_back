const mysql = require('mysql2/promise');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tatya313912',
    database: 'demo1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0 // Added database name
  });

module.exports = connection