const isAuthenticatedInstitute = (req, res, next) => {
    if (req.session && req.session.instituteId) {
        next();
    } else {
        res.status(403).send('Not authenticated as an institute');
    }
};
  
  module.exports = isAuthenticatedInstitute;
  