const express = require('express');
const multer = require('multer');
const router = express.Router();
const csvController = require('../controllers/dataInput');

// Initialize multer with a destination directory for your files
const upload = multer({ dest: 'uploads/' });


router.post('/api/import-csv/:tableName', upload.single('csvFilePath'), csvController.importCSV);


  
  

module.exports = router;


