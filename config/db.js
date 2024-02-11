const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const password = process.env.ADMIN_PSWD;
const mail = process.env.ADMIN_EMAIL;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database/database.sqlite'
});

const Account = sequelize.define('Account', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'User',
        validate: {
            isIn: [['User', 'Admin']] // Ensure role is either 'User' or 'Admin'
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [10, 10] // Ensure phone number is exactly 10 characters
        }
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Male', 'Female']] // Ensure gender is either 'Male' or 'Female'
        }
    },
    dateOfBirth: { type: DataTypes.DATE, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    refreshToken: { type: DataTypes.STRING } // Adding refreshToken column
}, {
    timestamps: true,
});

sequelize.sync()
    .then(async () => {
        console.log('All models synchronized successfully');

        // Add default admin account
        try {
            const existingAdmin = await Account.findOne({ where: { email: mail } });
            if (!existingAdmin) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await Account.create({
                    firstName: 'CodeRay',
                    lastName: 'Technologies',
                    email: mail,
                    passwordHash: hashedPassword,
                    role: 'Admin',
                    phoneNumber: '0769042770',
                    gender: 'Male',
                    dateOfBirth: '2000-01-01',
                    address: "No 38/56, Kandy Rd, Pettah",
                });
                console.log('Default admin account added successfully');
            }
        } catch (error) {
            console.error('Error adding default admin account:', error);
        }
    })
    .catch(error => {
        console.error('Error synchronizing models:', error);
    });

module.exports = {
    sequelize,
    Account
};
