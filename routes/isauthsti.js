const express = require('express');
const router = express.Router();

const isAuthenticatedInstitute = (req, res, next) => {
    if (req.session && req.session.instituteId) {
        console.log("Session exists, institute ID:", req.session.instituteId);
        next();
    } else {
        console.log("No valid session found.");
        res.status(403).send('Not authenticated as an institute');
    }
};


router.get('/check-auth', (req, res) => {
    if (req.session && req.session.instituteId) {
        console.log('uthentication')
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});


router.get('/check-admin', (req, res) => {
    if (req.session && req.session.adminid) {
        console.log('uthentication')
        res.json({ isAdminAuthenticated: true });
    } else {
        res.json({ isAdminAuthenticated: false });
    }
});
module.exports = router;