import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import SpotDetailCard from "./SpotDetailCard";
import "./index.css";

const Spots = () => {
    const spotsObj = useSelector((state) => state.spots.allSpots);

    const spotsArr = Object.values(spotsObj);

    if (!spotsArr) return null
    return (
        <div className="main-wrapper">
            <div className="card-wrapper">
                {spotsArr.map((spot) => (
                    <SpotDetailCard key={spot.id} {...spot} />
                ))}
            </div>
        </div>
    );
};

export default Spots;
