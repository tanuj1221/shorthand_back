const mysql = require('mysql2/promise');
const connection = mysql.createConnection({
    host: '13.235.95.5',
    user: 'root',
    password: 'Tatya313912',
    database: 'demo1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0 // Added database name
  });

module.exports = connection