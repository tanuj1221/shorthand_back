const fs = require('fs');
const fastCsv = require('fast-csv');
const pool = require("../config/db1");

exports.importCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const { tableName } = req.params;
  const csvFilePath = req.file.path;

  if (!tableName) {
    fs.unlinkSync(csvFilePath);
    return res.status(400).json({ error: 'Table name is required' });
  }

  try {
    const columns = await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(csvFilePath)
        .pipe(fastCsv.parse({ headers: true }))
        .on('error', reject)
        .on('data', (row) => {
          stream.pause();
          resolve(Object.keys(row));
          stream.destroy();
        })
        .on('end', () => {
          reject(new Error('No data found in the CSV file'));
        });
    });

    const createTableQuery = `CREATE TABLE IF NOT EXISTS ?? (
      ${columns.map(column => `\`${column}\` LONGTEXT`).join(', ')}
    )`;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query(createTableQuery, [tableName]);
      await connection.query(`TRUNCATE TABLE ??`, [tableName]);

      const stream = fs.createReadStream(csvFilePath)
        .pipe(fastCsv.parse({ headers: true }))
        .on('error', (error) => {
          throw error;
        });

      const insertPromises = [];
      const chunkSize = 1000;
      let chunk = [];

      for await (const row of stream) {
        chunk.push(row);
        if (chunk.length >= chunkSize) {
          insertPromises.push(insertChunk(connection, tableName, columns, chunk));
          chunk = [];
        }
      }

      if (chunk.length > 0) {
        insertPromises.push(insertChunk(connection, tableName, columns, chunk));
      }

      await Promise.all(insertPromises);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    fs.unlinkSync(csvFilePath);
    res.json({ message: `CSV data imported into table '${tableName}' successfully` });
  } catch (error) {
    console.error('Error processing CSV:', error.message);
    fs.unlinkSync(csvFilePath);
    res.status(500).json({ error: error.message });
  }
};

async function insertChunk(connection, tableName, columns, chunk) {
  const insertQuery = `INSERT INTO ?? (${columns.map(column => `\`${column}\``).join(', ')}) VALUES ?`;
  const values = chunk.map(row => {
    const rowValues = columns.map(column => row[column]);
    // Log the size of the 'image' column data for diagnostic purposes
    rowValues.forEach((value, index) => {
      if (columns[index] === 'image' && value) {
        console.log(`Size of image data: ${Buffer.byteLength(value, 'utf8')} bytes`);
      }
    });
    return rowValues;
  });
  await connection.query(insertQuery, [tableName, values]);
}