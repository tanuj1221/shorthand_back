const connection = require('../config/db1');

exports.fetchMockData = async (req, res) => {
    console.log("Fetching data from mockdb");
    const { subjectId } = req.query;  // Optional: Fetch by subjectId if provided

    let query = 'SELECT * FROM mockdb';
    let queryParams = [];

    // If a subjectId is provided, modify the query to include a WHERE clause
    if (subjectId) {
        query += ' WHERE subjectId = ?';
        queryParams.push(subjectId);
    }

    try {
        const [results] = await connection.query(query, queryParams);
        if (results.length > 0) {
            res.send(results);
        } else {
            res.status(404).send('No data found');
        }
    } catch (err) {
        console.error("Error while fetching data from mockdb", err);
        res.status(500).send(err.message);
    }
};