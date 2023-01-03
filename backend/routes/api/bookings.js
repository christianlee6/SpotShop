const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const {
    User,
    Spot,
    Review,
    SpotImage,
    Booking,
    sequelize,
} = require("../../db/models");

// DELETE A BOOKING
router.delete("/:bookingId", requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const badBooking = await Booking.findByPk(bookingId);

    if (!badBooking) {
        res.status(404);
        return res.json({
            message: "Booking couldn't be found",
            statusCode: 404,
        });
    }

    const badBookingSpot = await Spot.findOne({
        where: {
            ownerId: badBooking.spotId
        }
    })

    if (userId !== badBooking.userId && userId !== badBookingSpot.ownerId) {
        res.status(403);
        return res.json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    const todayDate = new Date ();
    if (badBooking.startDate.getTime() <= todayDate.getTime()) {
        res.status(403);
        return res.json({
            message: "Bookings that have been started can't be deleted",
            statusCode: 403
        })
    }

    await badBooking.destroy()

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
});

// EDIT A BOOKING
router.put("/:bookingId", requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const { startDate, endDate } = req.body;
    const start = new Date(startDate)
    const end = new Date(endDate)

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        res.status(404);
        return res.json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }

    const bookingStartDate = new Date(booking.startDate)
    const bookingEndDate = new Date(booking.endDate)
    const todayDate = new Date ();

    if (todayDate.getTime() >= bookingEndDate.getTime()) {
        res.status(403);
        return res.json({
            message: "Past bookings can't be modified",
            statusCode: 403
        })
    }

    const ownerId = booking.userId;
    if (ownerId !== userId) {
        res.status(404);
        return res.json({
            message: "Forbidden",
            statusCode: 404
        })
    }

    if (start >= end) {
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "endDate cannot come before startDate",
            }
        })
    }

    const bookings = await Booking.findAll({
        where: {
            spotId: booking.spotId
        }
    })

    let booked = false

    bookings.forEach(booking => {

        const bookingStartDate = new Date(booking.startDate)
        const bookingEndDate = new Date(booking.endDate)

        if (start.getTime() >= bookingStartDate.getTime() && start.getTime() <= bookingEndDate.getTime() || end.getTime() >= bookingStartDate.getTime() && end.getTime() <= bookingEndDate.getTime() || start.getTime() <= bookingStartDate.getTime() && end.getTime() >= bookingEndDate.getTime()) {
            booked = true
            res.status(403)
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            })
        }
    })

    if (!booked) {
        booking.set({
            startDate,
            endDate
        })

        await booking.save()

        res.status(200)
        return res.json(booking)
    }
});

// GET ALL OF THE CURRENT USERS BOOKINGS
router.get("/current", requireAuth, async (req, res) => {
    const current = req.user.id;

    const bookings = await Booking.findAll({
        where: {
            userId: current,
        },
        include: [
            {
                model: Spot,
                attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "price"],
                include: [
                    {
                        model: SpotImage,
                        attributes: ["url"]
                    }
                ]
            },
        ],

    });

    const bookingsList = []

    bookings.forEach(booking => {
        bookingsList.push(booking.toJSON())
    })

    const newBookingsList = []
    bookingsList.forEach(booking => {
        if (booking.Spot.SpotImages.length) {
            booking.Spot.previewImage = booking.Spot.SpotImages[0].url
        }

        delete booking.Spot.SpotImages
        newBookingsList.push(booking)
    })

    return res.json({
        Bookings: newBookingsList
    })

});

module.exports = router;
