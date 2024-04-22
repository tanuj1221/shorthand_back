// student Authention 
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/student_data');

router.post('/login', authController.loginStudent);
router.get('/logout', authController.logoutStudent);

module.exports = router;
