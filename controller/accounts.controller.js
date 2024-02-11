const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('../_middleware/authorize');
const accountService = require('../services/account.service');
require('dotenv').config();

// routes
router.post('/register', registerSchema, register);
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);

router.get('/', authorize('Admin'), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize('Admin'), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);


module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        phoneNumber: Joi.string().allow('', null),
        gender: Joi.string().valid('Male', 'Female'),
        dateOfBirth: Joi.date().iso().allow(null),
        address: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
}

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        phoneNumber: Joi.string(),
        gender: Joi.string().valid('Male', 'Female'),
        dateOfBirth: Joi.date().iso(),
        address: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),
        phoneNumber: Joi.string(),
        gender: Joi.string().valid('Male', 'Female', 'Other'),
        dateOfBirth: Joi.date().iso(),
        address: Joi.string().required()
    };

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, res, next, schema);
}

function validateRequest(req, res, next, schema) {
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        res.status(400).json({ message: error.details.map(x => x.message).join(', ') });
    } else {
        req.body = value;
        next();
    }
}

// Route handler for user registration
function register(req, res, next) {
    accountService.register(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

// Route handler for user authentication
function authenticate(req, res, next) {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    accountService.authenticate({ email, password, ipAddress })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

// Route handler for refreshing tokens
function refreshToken(req, res, next) {
    console.log("Refreshing token");

    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;

    console.log(token + " - " + ipAddress);
    accountService.refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

// Route handler for getting all users
function getAll(req, res, next) {
    accountService.getAll()
        .then(accounts => res.json(accounts))
        .catch(next);
}

// Route handler for getting a user by ID
function getById(req, res, next) {
    const userId = parseInt(req.params.id);
    console.log(userId);
    accountService.getById(userId)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}

// Route handler for creating a user
function create(req, res, next) {
    accountService.create(req.body)
        .then(account => res.json(account))
        .catch(next);
}

// Route handler for updating a user
function update(req, res, next) {
    const userId = parseInt(req.params.id);
    accountService.update(userId, req.body)
        .then(account => res.json(account))
        .catch(next);
}

// Route handler for deleting a user
function _delete(req, res, next) {
    const userId = parseInt(req.params.id);
    accountService.delete(userId)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}

// Helper function to set token cookie
function setTokenCookie(res, token) {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}
