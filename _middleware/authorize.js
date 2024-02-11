const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET_KEY;
const db = require('../config/db');

module.exports = authorize;

function authorize(roles = []) {
    function authenticateToken(req, res, next) {
        const token = req.headers['authorization'];
        console.log(req.headers['authorization']);
        if (!token) {
            console.error("No token provided");
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.error("Failed to authenticate token");
                return res.status(401).json({ message: 'Unauthorized: Failed to authenticate token' });
            }
            req.user = decoded;
            next();
        });
    }

    async function authorizeRole(req, res, next) {
        try {
            const account = await db.Account.findByPk(req.user.sub);
            if (!account || !account.dataValues) {
                console.error("Unauthorized: Account not found");
                return res.status(401).json({ message: 'Unauthorized: Account not found' });
            }

            if (req.params.id != req.user.sub) {
                console.error("Forbidden: User is not authorized to access this resource");
                return res.status(403).json({ message: 'Forbidden: User is not authorized to access this resource' });
            }

            req.user.role = account.dataValues.role;
            next();
        } catch (error) {
            console.error("Error in authorization:", error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return [authenticateToken, authorizeRole];
}
