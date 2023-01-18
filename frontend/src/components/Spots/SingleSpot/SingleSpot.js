import React, { useDebugValue, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import * as spotActions from "../../../store/spots";
import * as reviewActions from "../../../store/reviews";

const SingleSpot = ({}) => {
    const dispatch = useDispatch();
    const { id } = useParams();


    useEffect(() => {
        dispatch(spotActions.getSpotById(id));
        dispatch(reviewActions.getSpotReviews(id));
    }, [id, dispatch]);

    const spot = useSelector((state) => state.spots.singleSpot);
    console.log(spot);
    const rating = spot.avgStarRating;
    const reviews = Object.values(useSelector((state) => state.reviews.spot));

    console.log("@@@", spot.SpotImages)
    return (
        <div className="info-wrapper">
            <div className="header">
                <h2 className="spot-header">{spot.name}</h2>
                <div>
                    <div className="ratings">
                        <span style={{ width: "4rem" }}>
                            <i className="fa-sharp fa-solid fa-star"></i>
                            {isNaN(rating) ? 0 : rating}
                        </span>
                        {spot.numReviews === 1 ? (
                            <span style={{ width: "5rem" }}>
                                {spot.numReviews} review{" "}
                            </span>
                        ) : (
                            <span style={{ width: "5rem" }}>
                                {spot.numReviews} reviews{" "}
                            </span>
                        )}
                        <span style={{ width: "20rem" }}>
                            {spot.city}, {spot.state}, {spot.country}
                        </span>
                    </div>
                </div>
            </div>
            <div className="image-container">
                {/* <img
                    className="first-spot-image"
                    src={spot.SpotImages[0].url}
                    alt="first"
                /> */}
            </div>
            <div className="details">
                <div className="host">
                    {/* <h3 style={{ width: "20.15rem" }}>
                        This home is hosted by {spot.Owner.firstName}
                    </h3> */}
                    <div></div>
                </div>
                {/* <div className="booking-form"><ReserveForm {...spot}/></div> */}
            </div>
        </div>
    );
};

export default SingleSpot;
