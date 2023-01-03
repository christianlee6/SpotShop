'use strict';

const { Sequelize } = require('sequelize');
const { options } = require('../../routes');

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "www.this-is-a-spot-image-url.com",
        preview: false
      },
      {
        spotId: 1,
        url: "www.spot-image-url.com",
        preview: true
      },
      {
        spotId: 2,
        url: "www.this-is-also-a-spot-image-url.com",
        preview: true
      },
      {
        spotId: 3,
        url: "www.this-is-another-spot-image-url.com",
        preview: true
      },
      {
        spotId: 4,
        url: "www.spot-image-url.com",
        preview: false
      },
      {
        spotId: 2,
        url: "www.another-spot-image-url.com",
        preview: true
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
