const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const subjectController = require('../controllers/subjects')


router.get('/subjectsAndIds', subjectController.getSubjectIds);
router.get('/courses', isAuthenticated, subjectController.getCourses);
router.post('/audiolist', isAuthenticated, subjectController.audiosFromId);

module.exports = router;