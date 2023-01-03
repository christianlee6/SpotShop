// backend/routes/api/review.js
const express = require("express");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const {
    User,
    Spot,
    Review,
    ReviewImage,
    SpotImage,
    sequelize,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const user = require("../../db/models/user");
const { requireAuth } = require("../../utils/auth.js");

const router = express.Router();

// ADD AN IMAGE TO A REVIEW BASED ON REVIEW ID
router.post("/:reviewId/images", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { url } = req.body;
    const { reviewId } = req.params;

    const validReview = await Review.findByPk(reviewId);

    if (!validReview) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404,
        });
    }

    if (userId !== validReview.userId) {
        res.status(403);
        return res.json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId: reviewId,
        },
    });

    if (reviewImages.length >= 10) {
        res.status(403);
        return res.json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403,
        });
    }

    const newImage = await ReviewImage.build({
        url: url,
        reviewId,
    });

    await newImage.save();
    return res.json({
        id: newImage.id,
        url: newImage.url,
    });
});

// EDIT A REVIEW
router.put("/:reviewId", requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const updatedReview = await Review.findByPk(reviewId);

    if (!updatedReview) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404,
        });
    }

    const reviewUser = await Review.findByPk(reviewId);
    const ownerId = reviewUser.userId;

    if (ownerId !== userId) {
        res.status(404);
        return res.json({
            message: "Forbidden",
            statusCode: 404
        });
    }

    const { review, stars } = req.body;

    let errObj = {
        message: "Validation error",
        statusCode: 400,
        errors: {}
    }

    if (!review) {
        errObj.errors.review = "Review text is required"
    }

    if (!stars) {
        errObj.errors.stars = "Star rating is required"
    }

    if (stars < 1 || stars > 5) {
        errObj.errors.starsInteger = "Stars must be an integer from 1 to 5"
    }

    if (!review || !stars || stars < 1 || stars > 5) {
        res.status(400)
        return res.json(errObj)
    }

    updatedReview.set({
        review: review,
        stars: stars,
    });

    if (
        updatedReview.set({
            review: review,
            stars: stars,
        })
    ) {
        await updatedReview.save();
        res.status(200);
        return res.json(updatedReview);
    }
});

// DELETE A REVIEW
router.delete("/:reviewId", requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review) {
        res.status(404)
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404
        });
    }

    const ownerId = review.userId;
    if (ownerId !== userId) {
        res.status(403);
        return res.json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    if (review) {
        await review.destroy();
        res.status(200);
        return res.json({
            message: "Successfully deleted",
            statusCode: 200,
        });
    }
});

// GET ALL REVIEWS OF THE CURRENT USER
router.get("/current", requireAuth, async (req, res) => {
    const current = req.user.id;

    const reviews = await Review.findAll({
        where: {
            userId: current,
        },
        include: [
            {
                model: User,
            },
            {
                model: Spot,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "description"],
                },
                include: [
                    {
                        model: SpotImage
                    }
                ]
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"]
            }
        ],
    });

    let reviewsList = []
    reviews.forEach(review => {
        reviewsList.push(review.toJSON())
    })

    if (reviewsList.length === 0) {
        res.status(404)
        return res.json({
            message: "The current user has no reviews"
        })
    }

    reviewsList.forEach(async (review) => {
        review.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                review.Spot.previewImage = image.url
            }
        });

        delete review.Spot.SpotImages
    })

    return res.json({
        Reviews: reviewsList
    })
});

module.exports = router;
