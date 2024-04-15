const fs = require('fs');
const csv = require('csv-parser');
const pool = require("../config/db1")

exports.importCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const { tableName } = req.params;
  const csvFilePath = req.file.path;

  if (!tableName) {
    fs.unlinkSync(csvFilePath); // Clean up uploaded file
    return res.status(400).json({ error: 'Table name is required' });
  }

  try {
    const rows = [];
    const stream = fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => rows.push(data));

    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    if (rows.length === 0) {
      fs.unlinkSync(csvFilePath); // Clean up uploaded file
      return res.status(500).json({ error: 'No data found in the CSV file' });
    }

    const columns = Object.keys(rows[0]);
    const createTableQuery = `CREATE TABLE IF NOT EXISTS ?? (${columns.map(column => `\`${column}\` TEXT`).join(', ')})`;
    
    // Use connection from the pool to ensure proper transaction handling
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query(createTableQuery, [tableName]);

      // Truncate the table to remove existing data
      await connection.query(`TRUNCATE TABLE ??`, [tableName]);

      for (const row of rows) {
        const values = columns.map(column => row[column]);
        const insertQuery = `INSERT INTO ?? (${columns.map(column => `\`${column}\``).join(', ')}) VALUES (${new Array(values.length).fill('?').join(', ')})`;
        await connection.query(insertQuery, [tableName, ...values]);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error; // Rethrow after rollback
    } finally {
      connection.release(); // Release back to the pool
    }

    fs.unlinkSync(csvFilePath); // Clean up uploaded file
    res.json({ message: `CSV data imported into table '${tableName}' successfully` });
  } catch (error) {
    console.error('Error processing CSV:', error.message);
    fs.unlinkSync(csvFilePath); // Ensure uploaded file is cleaned up on error
    res.status(500).json({ error: error.message });
  }
};