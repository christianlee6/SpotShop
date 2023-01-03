'use strict';
const bcrypt = require("bcryptjs");

const { Sequelize } = require('sequelize');
const { options } = require('../../routes');

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: "Demo",
        lastName: "Lition",
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        email: 'demo@user.io'
      },
      {
        firstName: "Fake",
        lastName: "User1",
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        email: 'user1@user.io'
      },
      {
        firstName: "Fake",
        lastName: "User2",
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        email: 'user2@user.io',
      },
      {
        firstName: "Place",
        lastName: "Holder",
        username: 'PlaceHolder1',
        hashedPassword: bcrypt.hashSync('password4'),
        email: 'placeholder@user.io',
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
