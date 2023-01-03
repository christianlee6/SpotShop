'use strict';

const { Sequelize } = require('sequelize');
const { options } = require('../../routes');

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "www.this-is-a-url-to-a-review-image.com",
      },
      {
        reviewId: 2,
        url: "www.this-is-another-url-to-a-review-image.com",
      },
      {
        reviewId: 3,
        url: "www.another-review-image-url",
      },
      {
        reviewId: 4,
        url: "www.review-image-url",
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
