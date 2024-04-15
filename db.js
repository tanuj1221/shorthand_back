const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tanuj1221'
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected to MySQL Server! +${err}`);


  connection.query('CREATE DATABASE IF NOT EXISTS demo1', (err, result) => {
    if (err) throw err;
    console.log('Database checked/created successfully');
  });

  // Use the newly created database
  connection.query('USE demo1', (err, result) => {
    if (err) throw err;
  });

  // Create the student table
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS student (
    student_id CHAR(6) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    instituteId INT NOT NULL,
    batchNo VARCHAR(50),
    batchStartDate DATE,
    batchEndDate DATE,
    subjectsId JSON, 
    amount BOOLEAN NOT NULL
  )`;

  connection.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Table checked/created successfully');
  });

  const insertQuery = `
  INSERT INTO student (student_id,password, instituteId, batchNo, batchStartDate, batchEndDate, firstName, lastName, amount,subjectsId)
  VALUES (?,?, ?, ?, ?, ?, ?, ?, ?,?)
`;

const values = [100000,'1221', 13124, '1', '2024-02-21', '2024-02-29', 'Rajesh', 'Mishra', true,'[101, 102, 103]'];

connection.query(insertQuery, values, (err, result) => {
  if (err) throw err;
  console.log('Student data inserted successfully');
});


  connection.end();
});
