const express = require("express");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const {
    User,
    Spot,
    Review,
    SpotImage,
    ReviewImage,
    sequelize,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const user = require("../../db/models/user");
const { requireAuth } = require("../../utils/auth.js");

const router = express.Router();

// DELETE A REVIEW IMAGE
router.delete("/:imageId", requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;

    const badReviewImage = await ReviewImage.findByPk(imageId);

    if (!badReviewImage) {
        res.status(404);
        return res.json({
            message: "Review Image couldn't be found",
            statusCode: 404
        })
    }

    const review = await ReviewImage.findOne({
        include: {
            model: Review
        },
        where: {
            reviewId: imageId
        }
    })

    console.log("@@@@@", review.Review.userId)

    if (userId !== review.Review.userId) {
        res.status(403)
        return res.json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    if (badReviewImage) {
        await badReviewImage.destroy();
        res.status = 200;
        return res.json({
            message: "Successfully deleted",
            statusCode: 200,
        });
    }
});

module.exports = router;
