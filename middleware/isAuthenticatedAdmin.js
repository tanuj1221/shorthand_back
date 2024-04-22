const isAuthenticatedAdmin = (req, res, next) => {
    if (req.session && req.session.adminid) {
        next();
    } else {
        res.status(403).send('Not authenticated as an institute');
    }
};
  
  module.exports = isAuthenticatedAdmin;
  