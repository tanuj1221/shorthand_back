const express = require('express');

const router = express.Router();
const adminView = require('../controllers/adminView');
const isAuthenticatedAdmin = require('../middleware/isAuthenticatedAdmin');

// Route to handle password change
router.get('/district',  adminView.getDistricts);
router.get('/batch',  adminView.getBatchData);
router.get('/tables', isAuthenticatedAdmin,adminView.getAllTables);
router.get('/table/:tableName', adminView.getTheTable);
router.post('/save-table/:tableName', adminView.saveTheTable);

router.post('/admin_login',adminView.loginadmin);
router.get('/approve', adminView.getAllWaitingStudents);
router.post('/approved_student', adminView.approveStudent);
router.post('/rejected_student', adminView.rejectStudent);

module.exports = router;

