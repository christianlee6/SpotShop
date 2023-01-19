'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "http://static.trip101.com/paragraph_media/pictures/002/432/427/large/open-uri20191126-7823-1j5ft78?1620125217",
      },
      {
        reviewId: 2,
        url: "https://fliphtml5.com/learning-center/wp-content/uploads/2022/05/impressive-Airbnb-welcome-book.jpg",
      },
      {
        reviewId: 3,
        url: "https://a0.muscache.com/im/pictures/d47742c2-b912-4fd2-955b-a0c38ab3adab.jpg?im_w=720",
      },
      {
        reviewId: 4,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-615227143482972210/original/31b1f73d-b110-4379-87d1-7c648f15edcb.jpeg?im_w=720",
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
