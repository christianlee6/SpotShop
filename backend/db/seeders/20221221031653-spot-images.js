'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "https://photos.zillowstatic.com/fp/c1d16eda00278aa1f0fbe7f98a296f7c-cc_ft_1152.webp",
        preview: true
      },
      {
        spotId: 1,
        url: "https://photos.zillowstatic.com/fp/1ee296a3b186026f405091198401c3b8-o_a.webp",
        preview: false
      },
      {
        spotId: 1,
        url: "https://photos.zillowstatic.com/fp/69ed77ff8ac5745523ebd7bd9b3cafc9-o_a.webp",
        preview: false
      },
      {
        spotId: 1,
        url: "https://photos.zillowstatic.com/fp/f82a410be7d9b0d522d3de0761ea0b57-o_a.webp",
        preview: false
      },
      {
        spotId: 2,
        url: "https://photos.zillowstatic.com/fp/c87aecb038d064ffbf2e248e94e95b79-o_a.webp",
        preview: true
      },
      {
        spotId: 2,
        url: "https://photos.zillowstatic.com/fp/4aad6f11b54f59007d68aa3f9671bf47-o_a.webp",
        preview: false
      },
      {
        spotId: 2,
        url: "https://photos.zillowstatic.com/fp/10995ac9d7037bfa734d5a15745182d7-o_a.webp",
        preview: false
      },
      {
        spotId: 3,
        url: "https://photos.zillowstatic.com/fp/6ae4ef7bdd5c0a2969b69ba9a0b44dc7-o_a.webp",
        preview: true
      },
      {
        spotId: 3,
        url: "https://photos.zillowstatic.com/fp/4dc3b1dc06b83dd0c0eae5f96a0aea8f-o_a.webp",
        preview: false
      },
      {
        spotId: 3,
        url: "https://photos.zillowstatic.com/fp/4dc3b1dc06b83dd0c0eae5f96a0aea8f-o_a.webp",
        preview: false
      },
      {
        spotId: 4,
        url: "https://photos.zillowstatic.com/fp/4723b06d0fef75bfe2e794d652456577-cc_ft_1152.webp",
        preview: true
      },
      {
        spotId: 4,
        url: "https://photos.zillowstatic.com/fp/076818030baf121add601183fd25d8d6-o_a.webp",
        preview: false
      },
      {
        spotId: 4,
        url: "https://photos.zillowstatic.com/fp/577da6885a929c987bbdc43cef6223cf-o_a.webp",
        preview: false
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
