import React from "react";
import { Link } from "react-router-dom";
import "./SpotDetailCard.css";

const SpotDetailCard = (spot) => {
    const rating = spot.avgRating;

    if (!spot) return null;

    const distances = [113, 224, 512, 581, 223, 594, 918, 192, 108, 295]

    return (
        <div className="spot-card">
            <Link to={`/spots/${spot.id}`} style={{ textDecoration: "none" }}>
                <img
                    className={"image"}
                    src={spot.previewImage}
                    alt="sample"
                ></img>
                <div>
                    <span className="location">
                        {spot.city}, {spot.state}
                        <span style={{ fontWeight: "normal" }}>
                            <i className="fa-sharp fa-solid fa-star"></i>
                            {isNaN(rating) ? "No Reviews" : rating}
                        </span>
                    </span>
                    <span style={{ fontSize: "12px", color: "gray"}}>{distances[`${spot.id}`]} miles away</span>
                    <div style={{ fontSize: "12px", color: "white" }}>
                        <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                            ${spot.price}{" "}
                        </span>
                        night
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default SpotDetailCard;
