// backend/routes/api/spots.js
const express = require("express");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const {
    User,
    Spot,
    Review,
    SpotImage,
    ReviewImage,
    Booking,
    sequelize,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const user = require("../../db/models/user");
const { requireAuth } = require("../../utils/auth.js");

const router = express.Router();

// CREATE A BOOKING FROM A SPOT BASED ON THE SPOTS ID
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
    const spotId  = req.params.spotId;
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    const validSpot = await Spot.findByPk(spotId);

    if (!validSpot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    const ownerId = validSpot.ownerId;
    if (ownerId === userId) {
        res.status(403);
        return res.json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.getTime() >= end.getTime()) {
        res.status(400);
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "endDate cannot be on or before startDate.",
            },
        });
    }

    const existingBookings = await Booking.findAll({
        where: {
            spotId: spotId
        },
    });

    let booked = false

    existingBookings.forEach(booking => {

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

    if (booked === false) {
        const newBooking = await Booking.create({
            spotId: Number(spotId),
            userId: userId,
            startDate,
            endDate
        })

        res.status(200)
        return res.json(newBooking)
    }
});

// CREATE A REVIEW FOR A SPOT BASED ON SPOT ID
router.post("/:spotId/reviews", requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    const spotId = req.params.spotId;
    const userId = req.user.id;

    const validSpot = await Spot.findByPk(req.params.spotId);

    if (!validSpot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    const userReview = await Review.findOne({
        where: {
            userId: userId,
            spotId: spotId,
        },
    });

    if (userReview) {
        res.status(403);
        return res.json({
            message: "User already has a review for this spot",
            statusCode: 403,
        });
    }

    let errObj = {
        message: "Validation error",
        statusCode: 400,
        errors: {},
    };

    if (!review) {
        errObj.errors.review = "Review text is required";
    }

    if (!stars || stars > 5 || stars < 1) {
        errObj.errors.stars = "Stars must be an integer from 1 to 5";
    }

    if (!review || !stars || stars > 5 || stars < 1) {
        res.status(400);
        return res.json(errObj);
    }

    const newReview = await Review.create({
        review: review,
        stars: stars,
        userId: req.user.id,
        spotId: Number(spotId),
    });

    return res.json(newReview);
});

// ADD AN IMAGE TO A SPOT BASED ON SPOT ID
router.post("/:spotId/images", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { url, preview } = req.body;
    const { spotId } = req.params;

    const validSpot = await Spot.findByPk(spotId);

    if (!validSpot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    if (userId !== validSpot.ownerId) {
        res.status(403);
        return res.json({
            message: "Forbidden",
            statusCode: 403,
        });
    }

    const newImage = await SpotImage.create({
        url,
        preview,
        spotId: validSpot.id
    });

    return res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview,
    });
});

// EDIT A SPOT
router.put("/:spotId", requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const userId = req.user.id;

    const updatedSpot = await Spot.findByPk(spotId);

    if (!updatedSpot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    const spotUser = await Spot.findByPk(spotId);
    const ownerId = spotUser.ownerId;

    if (ownerId !== userId) {
        res.status(403);
        return res.json({
            message: "Forbidden",
            statusCode: 403,
        });
    }

    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    } = req.body;

    const errObj = {
        message: "Validation Error",
        statusCode: 400,
        errors: {}
    }

    if (!address) errObj.errors.address = "Street address is required"

    if (!city) errObj.errors.city = "City is required"

    if (!state) errObj.errors.state = "State is required"

    if (!country) errObj.errors.country = "Country is required"

    if (!lat) errObj.errors.lat = "Latitude is not valid"

    if (!lng) errObj.errors.lng = "Longitude is not valid"

    if (!name) errObj.errors.name = "Name is required"

    if (name) {
        if (name.length >= 50) {
            errObj.errors.name = "Name must be less than 50 characters"
        }
    }

    if (!description) errObj.errors.description = "Description is required"

    if (!price) errObj.errors.price = "Price per day is required"

    if (!address || !city || !state || !country || !lat || !lng || !name || name.length >= 50 || !description || !price) {
        res.status(400)
        return res.json(errObj)
    }

    updatedSpot.set({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price,
    });

    await updatedSpot.save();

    res.status(200);
    return res.json(updatedSpot);
});

// CREATE A SPOT
router.post("/", requireAuth, async (req, res) => {
    const current = req.user.id;
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    } = req.body;

    let errObj = {
        message: "Validation Error",
        statusCode: 400,
        errors: {},
    };

    if (!address) {
        errObj.errors.address = "Street address is required";
    }

    if (!city) {
        errObj.errors.city = "City is required";
    }

    if (!state) {
        errObj.errors.state = "State is required";
    }

    if (!country) {
        errObj.errors.country = "Country is required";
    }

    if (!lat) {
        errObj.errors.lat = "Latitude is not valid";
    }

    if (!lng) {
        errObj.errors.lng = "Longitude is not valid";
    }

    if (!name) {
        errObj.errors.name = "Name is required"
    }

    if (name) {
        if (name.length >= 50) {
            errObj.errors.name = "Name must be less than 50 characters"
        }
    }

    if (!description) {
        errObj.errors.description = "Description is required";
    }

    if (!price) {
        errObj.errors.price = "Price per day is required";
    }

    if (
        !address ||
        !city ||
        !state ||
        !country ||
        !lat ||
        !lng ||
        !name ||
        name.length >= 50 ||
        !description ||
        !price
    ) {
        res.status(400);
        return res.json(errObj);
    }

    const newSpot = await Spot.create({
        ownerId: Number(current),
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    });

    if (newSpot) {
        res.status(201);
        return res.json(newSpot);
    }
});

// GET ALL SPOTS OWNED BY THE CURRENT USER
router.get("/current", requireAuth, async (req, res) => {
    const current = req.user.id;

    const spots = await Spot.findAll({
        where: {
            ownerId: current,
        },
        include: [
            {
                model: Review,
            },
            {
                model: SpotImage,
            },
        ],
    });

    let spotList = [];
    spots.forEach((spot) => {
        spotList.push(spot.toJSON());
    });

    spotList.forEach((spot) => {
        spot.SpotImages.forEach((image) => {
            if (image.preview === true) {
                spot.previewImage = image.url;
            }
        });

        if (!spot.previewImage) {
            spot.previewImage = "No preview available";
        }

        delete spot.SpotImages;

        let total = 0
        spot.Reviews.forEach(review => {
            total += review.stars
        })

        spot.avgRating = (total / spot.Reviews.length).toFixed(1)

        delete spot.Reviews
    });

    return res.json({
        Spots: spotList
    })
});

// GET ALL BOOKINGS FOR A SPOT BASED ON SPOT ID
router.get("/:spotId/bookings", async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    if (userId !== spot.ownerId) {
        const bookings = await Booking.findAll({
            attributes: ["spotId", "startDate", "endDate"],
            where: {
                spotId: spotId,
            },
        });
        if (bookings.length === 0) {
            res.status(404);
            return res.json({
                message: "No bookings for this spot",
                statusCode: 404,
            });
        }
        let Bookings = [];
        bookings.forEach((booking) => {
            Bookings.push(booking.toJSON());
        });
        let payload = { Bookings };
        return res.json(payload);
    }

    if (userId === spot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId,
            },
            include: [
                {
                    model: User,
                },
            ],
        });
        let Bookings = [];
        bookings.forEach((booking) => {
            Bookings.push(booking.toJSON());
        });
        let payload = { Bookings };
        return res.json(payload);
    }
});

// GET ALL REVIEWS BY A SPOTS ID
router.get("/:spotId/reviews", async (req, res) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    const reviews = await Review.findAll({
        where: {
            spotId: spotId,
        },
        include: [
            {
                model: User,
            },
            {
                model: ReviewImage,
            },
        ],
    });

    let Reviews = [];
    reviews.forEach((review) => {
        Reviews.push(review.toJSON());
    });

    Reviews.forEach((review) => {
        if (review.ReviewImages.length === 0) {
            review.ReviewImages = "This review does not contain any images";
        }
    });

    return res.json({
        Reviews: Reviews
    });
});

// GET DETAILS OF A SPOT FROM AN ID
router.get("/:spotId", async (req, res) => {
    const spotId = req.params.spotId;

    let spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    spot = spot.toJSON()

    spot.numReviews = await Review.count({
        where: {
            spotId: spotId
        }
    })

    const starRating = await Review.sum("stars", {
        where: {
            spotId: spotId
        }
    })

    const starCount = await Review.count({
        where: {
            spotId: spotId
        }
    })

    spot.avgStarRating = Number((starRating / starCount).toFixed(2))

    spot.SpotImages = await SpotImage.findAll({
        attributes: ["id", "url", "preview"],
        where: {
            spotId: spotId
        }
    })

    spot.Owner = await User.findOne({
        attributes: ["id", "firstName", "lastName"],
        where: {
            id: spot.ownerId
        }
    })

    return res.json(spot)
});

// GET ALL SPOTS
router.get("/", async (req, res) => {
    const pagination = {}
    const where = {}
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

    if (!page) page = 1
    if (page > 10) page = 20
    if (!size || size > 20 ) size = 20

    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }

    if (page < 1 || size < 1 || isNaN(minLat) && minLat !== undefined || isNaN(maxLat) && maxLat !== undefined || isNaN(minLng) && minLng !== undefined || isNaN(maxLng) && maxLng !== undefined || minPrice < 0 || maxPrice < 0) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                "page": "Page must be greater than or equal to 1",
                "size": "Size must be greater than or equal to 1",
                "maxLat": "Maximum latitude is invalid",
                "minLat": "Minimum latitude is invalid",
                "minLng": "Maximum longitude is invalid",
                "maxLng": "Minimum longitude is invalid",
                "minPrice": "Maximum price must be greater than or equal to 0",
                "maxPrice": "Minimum price must be greater than or equal to 0"
            }
        })
    } else {
        if (minLat && maxLat) where.lat = {[Op.between]: [minLat, maxLat]}
        else if (minLat) where.last = {[Op.gte]: minLat}
        else if (maxLat) where.lat = {[Op.lte]: maxLat}

        if (minLng && maxLng) where.lng = {[Op.between]: [minLng, maxLng]}
        else if (minLng) where.lng = {[Op.gte]: minLng}
        else if (maxLng) where.lng = {[Op.lte]: maxLng}

        if (minPrice && maxPrice) where.price = {[Op.between]: [minPrice, maxPrice]}
        else if (minPrice) where.price = {[Op.gte]: minPrice}
        else if (maxPrice) where.price = {[Op.lte]: maxPrice}
    }

    const spots = await Spot.findAll({
        include: [
            {
                model: SpotImage,
            },
            {
                model: Review,
            },
        ],
        ...pagination
    });

    let spotList = [];
    spots.forEach((spot) => {
        spotList.push(spot.toJSON());
    });

    spotList.forEach((spot) => {
        spot.SpotImages.forEach((image) => {
            if (image.preview === true) {
                spot.previewImage = image.url;
            }
        });

        if (!spot.previewImage) {
            spot.previewImage = "No preview available";
        }

        delete spot.SpotImages;

        let total = 0
        spot.Reviews.forEach(review => {
            total += review.stars
        })

        spot.avgRating = (total / spot.Reviews.length).toFixed(1)

        if (isNaN(spot.avgRating)) {
            spot.avgRating = "No average rating available"
        }

        delete spot.Reviews
    });

    page = Number(page)
    size = Number(size)

    return res.json({
        Spots: spotList,
        page,
        size
    })
});

// DELETE A SPOT
router.delete("/:spotId", requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404,
        });
    }

    const ownerId = spot.ownerId;
    if (ownerId !== userId) {
        res.status(403);
        return res.json({
            message: "Forbidden",
            statusCode: 403,
        });
    }


    if (spot) {
        await spot.destroy();
        res.status(200);
        return res.json({
            message: "Successfully deleted",
            statusCode: 200,
        });
    }
});

module.exports = router;
