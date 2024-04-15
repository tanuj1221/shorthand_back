// student Authention 
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/student_data');

router.post('/login', authController.loginStudent);

module.exports = router;
