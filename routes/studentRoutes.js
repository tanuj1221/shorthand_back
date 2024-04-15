const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthenticatedsti = require('../middleware/isAunthenticatedInstitute')
const studentController = require('../controllers/student_data');

// Route to handle password change
router.post('/change-password', isAuthenticated, studentController.changePassword);
router.get('/studentdata',isAuthenticated,studentController.getstudentData);
router.get('/getsubjects', isAuthenticated, studentController.getStudentSubjects);
router.post('/change-password', isAuthenticated, studentController.changePassword);
router.post('/updateTimerEndpoint', isAuthenticated, studentController.updateTimer);
router.get('/subinfo', isAuthenticated, studentController.getStudentSubjectInfo);


module.exports = router;