const express = require('express');

const router = express.Router();
const adminView = require('../controllers/adminView');

// Route to handle password change
router.get('/district',  adminView.getDistricts);
router.get('/batch',  adminView.getBatchData);


module.exports = router;