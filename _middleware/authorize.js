const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET_KEY;
const db = require('../config/db');

module.exports = authorize;

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    // Middleware to authenticate JWT token and attach user to request object
    function authenticateToken(req, res, next) {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = decoded;
            next();
        });
    }

    // Middleware to authorize based on user role
    async function authorizeRole(req, res, next) {
        const account = await db.Account.findByPk(req.user.sub);
        if (!account || !account.dataValues) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (req.params.id != req.user.sub) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.user.role = account.dataValues.role;
        next();
    }

    return [authenticateToken, authorizeRole];
}
