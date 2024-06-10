const connection = require('../config/db1');

const pool = require('../config/db1');
exports.getDistricts = async (req, res) => {
    try {
        const batchQuery = "SELECT * FROM district";
        const batchData = await connection.query(batchQuery);

        if (batchData !== null) {
            res.json(batchData[0]);
        } else {
            res.status(404).send("District database not added, please add it");
        }
    } catch (err) {
        res.status(500).send(err);
    }
};


exports.getBatchData = async (req, res) => {
    try {
        const batchQuery = "SELECT * FROM batch";
        const batchData = await connection.query(batchQuery);

        if (batchData !== null) {
            res.json(batchData[0]);
        } else {
            res.status(404).send("District database not added, please add it");
        }
    } catch (err) {
        res.status(500).send(err);
    }
};


exports.getAllTables = async (req, res) => {
    try {
        const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'";
        const connection = await pool.getConnection();
        
        try {
            const [results] = await connection.query(query);
            connection.release();
  
            // Extract table names and send them in the response
            const tableNames = results.map(row => row.TABLE_NAME); // Adjusted from table_name to TABLE_NAME
            res.json({ tables: tableNames });
            console.log(tableNames); // Log the correct table names to verify
        } catch (error) {
            connection.release();
            console.error('Failed to retrieve table names:', error);
            res.status(500).json({ error: 'Failed to retrieve table names' });
        }
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection error' });
    }
};

  
exports.loginadmin= async (req, res) => {
    console.log("Trying admin login");
    const { userId, password } = req.body;
  
    const query1 = 'SELECT * FROM admindb WHERE adminid = ?';
  
    try {
        const [results] = await connection.query(query1, [userId]);
        if (results.length > 0) {
            const institute = results[0];
            console.log(institute);
  
            if (institute.password === password) {
                // Set institute session
                req.session.adminid = institute.adminid;
                res.send('Logged in successfully as an institute!');
            } else {
                res.status(401).send('Invalid credentials for institute');
            }
        } else {
            res.status(404).send('Institute not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
  };

exports.getTheTable = async (req, res) => {
    try {
        const validTables = ['student14', 'admindb', 'audiodb1', 'batch', 'coursesdb1', 'institutedb', 'savedata', 'subjectsdb','qrpay'];
        const tableName = req.params.tableName;

        if(!validTables.includes(tableName)){
            return res.status(400).send('Nope, thats not a table sir!');
        }

        const tableQuery = `SELECT * FROM ${tableName}`;
        const [table] = await connection.query(tableQuery, [tableName]);
        
        const str = "this is it";
        console.log(table, tableName, str);

        if (table.length === 0) {
            res.status(404).send("table not found");
            return;
        }

        res.json(table);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Failed to retrieve table data");
    }
};

exports.saveTheTable = async (req, res) => {
    try{
        const tableName = req.params.tableName;
        const tableData = req.body;

        console.log("saveTheTable tableName: " + tableName);
        console.log("saveTheTable tableData: " + tableData);
        
        //clear the table before repopulating
        await connection.query(`TRUNCATE TABLE ${tableName};`);
        
        for(const row of tableData){
            const insertQuery = `INSERT INTO ${tableName} VALUES (?)`;
            const [table] = await connection.query(insertQuery, [Object.values(row)]);
            console.log("shubh: backend: "+ [Object.values(row)]);
        }

        console.log('Data saved successfully');
        res.status(200).json({ message: 'Table data saved successfully' });

    }catch(err){
        console.log("Exception saving table here is error: "+err);
        res.status(500).json({ error: 'Failed to save data to DB' });
    }
};



exports.getAllWaitingStudents = async (req, res) => {
    try {
      const detailsQuery = `
        SELECT qrpay.*, student14.instituteId, student14.student_id
        FROM qrpay
        INNER JOIN student14 ON qrpay.student_id = student14.student_id
        WHERE student14.amount = 'waiting';
      `;
  
      const [details] = await connection.query(detailsQuery);
  
      if (details.length > 0) {
        res.send(details);
      } else {
        res.status(404).send('No waiting students found');
      }
    } catch (err) {
      console.error('Error fetching waiting students:', err);
      res.status(500).send(err.message);
    }
  };


  
exports.approveStudent = async (req, res) => {
    const { student_id } = req.body;
  
    if (!student_id) {
      return res.status(400).send('Student ID is required');
    }
  
    try {
      const updateQuery = `
        UPDATE student14
        SET amount = 'paid'
        WHERE student_id = ? AND amount = 'waiting';
      `;
  
      const [result] = await connection.query(updateQuery, [student_id]);
  
      if (result.affectedRows > 0) {
        res.send({ message: 'Student approved successfully', studentId: student_id });
      } else {
        res.status(404).send('Student not found or was not in waiting status');
      }
    } catch (err) {
      console.log('Error approving student:', err);
      res.status(500).send(err.message);
    }
  };