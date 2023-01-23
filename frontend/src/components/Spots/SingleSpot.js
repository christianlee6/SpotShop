import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { getOneSpotThunk } from "../../store/spots";
import noimage from "./images/noimage.png";
import aircover from "./images/aircover.webp";
import './Spots.css'

import LoadSpotReviews from "../Reviews/LoadSpotReviews";

const LoadSingleSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    const { spotId } = useParams();

    const spot = useSelector((state) => {
        return state.spots.singleSpot;
    });

    const reviews = useSelector((state) => {
        return state.reviews.spot;
    });
    console.log("REVIEWS", reviews)

    useEffect(() => {
        dispatch(getOneSpotThunk(+spotId));
    }, [dispatch, spotId, reviews]);

    const sessionUser = useSelector((state) => state.session.user);
    let isOwner = false;
    if (sessionUser?.id === spot.ownerId) isOwner = true;

    if (!Object.values(spot).length) return null;

    let displayImages = [...spot.SpotImages];
    let previewImage = displayImages.find((image) => {
        return image.preview === true;
    });

    if (!previewImage) {
        previewImage = displayImages[0];
        displayImages.splice(0, 1);
    } else {
        displayImages.splice(displayImages.indexOf(previewImage), 1);
    }
    let noPreviewCount = displayImages.length;
    if (noPreviewCount < 4) {
        for (let i = 3; i >= noPreviewCount; i--) {
            displayImages[i] = { "url": noimage };
        }
    }

    const handleClick = async (e) => {
        history.push(`/spots/${spotId}/create-review`)
    }

    return (
        <>
            <div className="single-spot-container">
                <div className="single-spot-header">
                    <div className="single-spot-header-name">
                        <h1>{spot.name}</h1>
                    </div>

                    <div className="single-spot-header-detail">
                        {spot.avgStarRating === "No average star rating available"? (
                            <span>★ New · </span>
                        ) : (
                            <span>★ {spot.avgStarRating} · </span>
                        )}
                        <span>{spot.numReviews} reviews · </span>
                        <span>Superhost · </span>
                        <span>
                            {spot.city}, {spot.state}, {spot.country}
                        </span>
                    </div>
                </div>

                <div className="single-spot-image-container">
                    <div>
                        {previewImage && (
                            <img
                                className="single-spot-preview-image"
                                alt={spot.name}
                                src={previewImage.url}
                            />
                        )}
                    </div>
                    <div className="single-spot-other-images-container">
                        {displayImages.length ? (
                            displayImages.map((image) => (
                                <img
                                    className="single-spot-other-image"
                                    key={image.id}
                                    src={image.url}
                                />
                            ))
                        ) : (
                            <div>Listing has no other images</div>
                        )}
                    </div>
                </div>

                <div className="single-spot-bottom-images">
                    <div className="single-spot-bottom-left">
                        <h2>Entire home hosted by {spot.Owner.firstName}</h2>
                        <div className="single-spot-linebreak"></div>
                        <div>
                            <img className="aircover" src={aircover} />
                            Every booking includes free protection from Host
                            cancellations, listing inaccuracies, and other
                            issues like trouble checking in.
                        </div>
                        <div className="single-spot-linebreak"></div>
                        <div>{spot.description}</div>
                    </div>
                </div>

                <div className="single-spot-bottom-right-floating">
                    <div className="floating-header">
                        <div>
                            <span className="single-spot-price">
                                ${spot.price}
                            </span> night
                        </div>

                        <div className="single-spot-floating-review">
                            <span>
                                {spot.avgStarRating ? (<span className="bold">★ {spot.avgStarRating}  ·  </span>):(<span className="bold">★ New  ·   </span>)}
                            </span>
                            <span>{spot.numReviews} reviews</span>
                        </div>
                    </div>
                </div>

            <div className="single-spot-linebreak long"></div>

            <h2 className="single-spot-above-review">
                <span>
                {spot.avgStarRating === "No average star rating available"? (
                            <span className="bold">★ New · </span>
                        ) : (
                            <span className="bold">★ {spot.avgStarRating} · </span>
                        )}
                </span>
                <span>{spot.numReviews} reviews</span>
            </h2>

            <div className="write-review-wrapper">
                {
                    sessionUser && !isOwner && <button className="write-review-button" onClick={handleClick}>Write a Review for this Spot</button>
                }
            </div>
            <div className="single-spot-linebreak long"></div>

            <div className="single-spot-reviews-container">
                <LoadSpotReviews spotId={spotId}/>
            </div>
            </div>
        </>
    );
};

export default LoadSingleSpot;
