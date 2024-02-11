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
    if (await db.Account.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = new db.Account(params);
    account.passwordHash = await hash(params.password);
    await account.save();
}


async function authenticate({ email, password, ipAddress }) {
    try {
        const account = await db.Account.findOne({ where: { email } });

        if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
            throw 'Email or password is incorrect';
        }

        const jwtToken = generateJwtToken(account);
        const refreshToken = await generateRefreshToken(account, ipAddress);

        return {
            ...basicDetails(account),
            accessToken: jwtToken,
            refreshToken: refreshToken
        };
    } catch (error) {
        throw error;
    }
}

async function refreshToken({ token, ipAddress }) {
    const decoded = jwt.verify(token, secret);
    const account = await db.Account.findByPk(decoded.sub);

    const newRefreshToken = await generateRefreshToken(account, ipAddress);
    const existingRefreshToken = await db.RefreshToken.findOne({ where: { AccountId: account.id } });

    if (existingRefreshToken) {
        await existingRefreshToken.destroy();
    }

    const jwtToken = generateJwtToken(account);

    return {
        ...basicDetails(account),
        accessToken: jwtToken.token,
        refreshToken: newRefreshToken.token
    };
}

async function getAll() {
    const accounts = await db.Account.findAll();
    return accounts.map(x => basicDetails(x));
}

async function getById(id) {
    const account = await getAccount(id);
    return basicDetails(account);
}

async function create(params) {
    if (await db.Account.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = new db.Account(params);
    account.verified = Date.now();
    account.passwordHash = await hash(params.password);
    await account.save();

    return basicDetails(account);
}

async function update(id, params) {
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

    return basicDetails(account);
}

async function _delete(id) {
    const account = await getAccount(id);
    await account.destroy();
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

async function generateRefreshToken(account) {
    const token = jwt.sign({ sub: account.id }, secret, { expiresIn: '7d' });

    // Create a new refresh token
    await db.Account.update({ refreshToken: token }, { where: { id: account.id } });
    return token;
}



function basicDetails(account) {
    const { id, firstName, lastName, email, role, created, updated, phoneNumber, gender, dateOfBirth, address } = account;
    return { id, firstName, lastName, email, role, created, updated, phoneNumber, gender, dateOfBirth, address };
}
