'use strict';

const { Sequelize } = require('sequelize');
const { options } = require('../../routes');

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = "Bookings";
        return queryInterface.bulkInsert(options, [
            {
                spotId: 1,
                userId: 1,
                startDate: new Date("2/2/2023"),
                endDate: new Date("2/10/2023")
            },
            {
                spotId: 2,
                userId: 2,
                startDate: new Date("2/5/2023"),
                endDate: new Date("2/10/2023")
            },
            {
                spotId: 3,
                userId: 3,
                startDate: new Date("2/20/2023"),
                endDate: new Date("2/28/2023")
            },
            {
                spotId: 1,
                userId: 1,
                startDate: new Date("2/15/2023"),
                endDate: new Date("2/20/2023")
            },
            {
                spotId: 2,
                userId: 2,
                startDate: new Date("2/25/2023"),
                endDate: new Date("2/28/2023")
            },
        ])
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = "Bookings";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
            spotId: { [Op.in]: [1, 2, 3] }
        }, {});
    }
};
