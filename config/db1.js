const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: '13.235.95.5',
    user: 'root',
    password: 'tanuj1221',
    database: 'demo1',
    waitForConnections: true,
    connectionLimit: 100000,
    queueLimit: 0 // Added database name
  });

module.exports = connection