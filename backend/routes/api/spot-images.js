const express = require("express");
const router = express.Router();
const {
    User,
    Spot,
    Review,
    SpotImage,
    ReviewImage,
    sequelize,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");


// DELETE A SPOT IMAGE
router.delete("/:imageId", requireAuth, async (req, res) => {
    const {imageId} = req.params;
    const userId = req.user.id;

    const badSpotImage = await SpotImage.findOne({
        where: {
            id: imageId
        },
        include: [
            {
                model: Spot
            }
        ]
    })

    if (!badSpotImage) {
        res.status(404);
        return res.json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        })
    }

    if (userId !== badSpotImage.Spot.ownerId) {
        res.status(403);
        return res.json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    if (badSpotImage) {
        await badImage.destroy();
        res.status(200);
        return res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }
})

module.exports = router;
