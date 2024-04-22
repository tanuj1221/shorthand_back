const connection = require('../config/db1');


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
            const tableNames = results.map(row => row.table_name);
            res.json({ tables: tableNames });
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
                req.session.instituteId = institute.instituteId;
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
  