const express = require('express');
const router = express.Router();
const mockcontroller  = require('../controllers/mockdata')


router.get('/mocktests',mockcontroller.fetchMockData)

module.exports = router;