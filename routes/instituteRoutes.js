const express = require('express');
const router = express.Router();

const connection = require('../config/db1');

const isAuthenticatedInsti = require('../middleware/isAunthenticatedInstitute');
const instituteController = require('../controllers/Institute');

// institute logion
router.post('/login_institute', instituteController.loginInstitute);
router.get('/students', isAuthenticatedInsti, instituteController.getStudentsByInstitute);
router.post('/registerstudent',isAuthenticatedInsti,instituteController.registerStudent);
router.get('/getstudents', isAuthenticatedInsti, instituteController.getstudentslist);
router.get('/paystudents', isAuthenticatedInsti, instituteController.getPendingAmountStudentsList);
// router.get('/studentsubjects', isAuthenticatedInsti, instituteController.getPendingAmountStudentsList);

router.delete('/studentsdel/:id',isAuthenticatedInsti, instituteController.deleteStudent);

router.delete('/deletetable/:tableName', async (req, res) => {
    const tableName = req.params.tableName;
    // Prevent SQL injection by validating the table name against a list of known good table names
    const allowedTables = ['student14', 'subjectsDb','audiodb1']; // Define allowed tables

    if (!allowedTables.includes(tableName)) {
        return res.status(400).send('Invalid table name');
    }

    try {
        await connection.query(`DROP TABLE ??`, [tableName]);
        res.send(`Table ${tableName} successfully deleted.`);
    } catch (error) {
        console.error('Failed to delete table:', error);
        res.status(500).send('Failed to delete table');
    }
});
router.get('/students/details/:id', instituteController.getStudentById);

module.exports = router;  