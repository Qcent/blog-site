const { User } = require('../models');

const userData = [{
        username: 'Tim',
        email: 'email1@gmail.com',
        password: 'password1'
    },
    {
        username: 'Bob',
        email: 'email2@gmail.com',
        password: 'password2'
    },
    {
        username: 'Eric',
        email: 'email3@gmail.com',
        password: 'password3'
    },
    {
        username: 'Greg',
        email: 'email4@gmail.com',
        password: 'password4'
    },
    {
        username: 'Mark',
        email: 'email5@gmail.com',
        password: 'password5'
    },
    {
        username: 'Dave',
        email: 'email6@gmail.com',
        password: 'password6'
    }

];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;