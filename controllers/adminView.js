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