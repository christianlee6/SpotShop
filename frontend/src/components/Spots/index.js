import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SpotDetailCard from "./SpotDetailCard";
import { getAllSpotsThunk, resetSpots } from "../../store/spots";
import "./Spots.css";

const Spots = () => {
    const dispatch = useDispatch();

    const spotsObj = useSelector((state) => state.spots.allSpots);

    const spotsArr = Object.values(spotsObj);

    useEffect(() => {
        dispatch(getAllSpotsThunk());

        return () => {
            dispatch(resetSpots);
        };
    }, [dispatch]);

    if (!spotsArr.length) return null;
    return (
        <>
            <div className="wrapper-center">
                <div className="allspots-container">
                    {spotsArr.map((spot) => (
                        <SpotDetailCard key={spot.id} spot={spot} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Spots;
