const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Placeholder for JWT authentication middleware
    next();
};

const adminAuth = (req, res, next) => {
    // Placeholder for admin authorization middleware
    next();
};

module.exports = { auth, adminAuth };
