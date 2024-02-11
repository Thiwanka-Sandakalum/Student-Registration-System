const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.SECRET_KEY;

module.exports = {
    register,
    authenticate,
    refreshToken,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function register(params) {
    try {
        if (await db.Account.findOne({ where: { email: params.email } })) {
            throw 'Email "' + params.email + '" is already registered';
        }

        const account = new db.Account(params);
        account.passwordHash = await hash(params.password);
        await account.save();

        console.log('User registered successfully:', basicDetails(account));
    } catch (error) {
        console.error('Error in registration:', error);
        throw error;
    }
}

async function authenticate({ email, password, ipAddress }) {
    try {
        const account = await db.Account.findOne({ where: { email } });

        if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
            throw 'Email or password is incorrect';
        }

        const jwtToken = generateJwtToken(account);
        const refreshToken = await generateRefreshToken(account, ipAddress);

        console.log('User authenticated successfully:', basicDetails(account));

        return {
            ...basicDetails(account),
            accessToken: jwtToken,
            refreshToken: refreshToken
        };
    } catch (error) {
        console.error('Error in authentication:', error);
        throw error;
    }
}

async function refreshToken({ token, ipAddress }) {
    try {
        const decoded = jwt.verify(token, secret);
        const account = await db.Account.findByPk(decoded.sub);

        const newRefreshToken = await generateRefreshToken(account, ipAddress);
        const existingRefreshToken = await db.RefreshToken.findOne({ where: { AccountId: account.id } });

        if (existingRefreshToken) {
            await existingRefreshToken.destroy();
        }

        const jwtToken = generateJwtToken(account);

        console.log('Token refreshed successfully:', basicDetails(account));

        return {
            ...basicDetails(account),
            accessToken: jwtToken.token,
            refreshToken: newRefreshToken.token
        };
    } catch (error) {
        console.error('Error in refreshing token:', error);
        throw error;
    }
}

async function getAll() {
    try {
        const accounts = await db.Account.findAll();
        const details = accounts.map(x => basicDetails(x));

        console.log('Retrieved all accounts:', details);

        return details;
    } catch (error) {
        console.error('Error in retrieving all accounts:', error);
        throw error;
    }
}

async function getById(id) {
    try {
        const account = await getAccount(id);

        console.log('Retrieved account by ID:', basicDetails(account));

        return basicDetails(account);
    } catch (error) {
        console.error('Error in retrieving account by ID:', error);
        throw error;
    }
}

async function create(params) {
    try {
        if (await db.Account.findOne({ where: { email: params.email } })) {
            throw 'Email "' + params.email + '" is already registered';
        }

        const account = new db.Account(params);
        account.verified = Date.now();
        account.passwordHash = await hash(params.password);
        await account.save();

        console.log('User created successfully:', basicDetails(account));

        return basicDetails(account);
    } catch (error) {
        console.error('Error in creating user:', error);
        throw error;
    }
}

async function update(id, params) {
    try {
        const account = await getAccount(id);

        if (params.email && account.email !== params.email && await db.Account.findOne({ where: { email: params.email } })) {
            throw 'Email "' + params.email + '" is already taken';
        }

        if (params.password) {
            params.passwordHash = await hash(params.password);
        }

        Object.assign(account, params);
        account.updated = Date.now();
        await account.save();

        console.log('User updated successfully:', basicDetails(account));

        return basicDetails(account);
    } catch (error) {
        console.error('Error in updating user:', error);
        throw error;
    }
}

async function _delete(id) {
    try {
        const account = await getAccount(id);
        await account.destroy();

        console.log('User deleted successfully:', basicDetails(account));
    } catch (error) {
        console.error('Error in deleting user:', error);
        throw error;
    }
}

async function getAccount(id) {
    const account = await db.Account.findByPk(id);
    if (!account) throw 'Account not found';
    return account;
}

async function hash(password) {
    return await bcrypt.hash(password, 10);
}

function generateJwtToken(account) {
    return jwt.sign({ sub: account.id }, secret, { expiresIn: '15m' });
}

async function generateRefreshToken(account, ipAddress) {
    const token = jwt.sign({ sub: account.id }, secret, { expiresIn: '7d' });

    await db.Account.update({ refreshToken: token }, { where: { id: account.id } });

    console.log('Refresh token generated successfully for user:', basicDetails(account));

    return token;
}

function basicDetails(account) {
    const { id, firstName, lastName, email, role, created, updated, phoneNumber, gender, dateOfBirth, address } = account;
    return { id, firstName, lastName, email, role, created, updated, phoneNumber, gender, dateOfBirth, address };
}
