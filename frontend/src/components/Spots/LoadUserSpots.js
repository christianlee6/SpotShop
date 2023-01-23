import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Redirect, useHistory } from "react-router-dom"
import { getSpotsOfUserThunk, deleteSpotThunk, resetSpots } from "../../store/spots"

import MySpots from "./MySpots"
import './Spots.css'
import noimage from "./images/noimage.png";

import { Link } from "react-router-dom"

const LoadUserSpots = ({ spot }) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const spotsObj = useSelector(state => state.spots.allSpots)
    const spotsArr = Object.values(spotsObj)


    useEffect(() => {
        dispatch(getSpotsOfUserThunk())


    }, [dispatch, spotsArr])

    // const deleteHandleClick = async () => {
    //     if (
    //         window.confirm(
    //             "Are you sure you want to delete this spot? This action is irreversible."
    //         )
    //     ) {
    //         dispatch(deleteSpotThunk(Number(spot.id)));
    //     }
    // };

    // const editHandleClick = async () => {
    //     history.push(`/myspots/edit/${spot.id}`);
    // };

    if (!sessionUser) return null
    if (!spotsObj) return null
    if (!sessionUser) return <Redirect to="/"/>

    return (
        <>
            <div className="myspots-header">
                {
                    spotsArr.length === 0 ? (<><h1>My Spots</h1><h4>Oops! It looks like you don't have any spots.</h4></>) : (<h1>My Spots</h1>)
                }
            </div>

            <div className="wrapper-center">
                <div className="allspots-container myspots">
                    {/* {
                        spotsArr.map((spot) => (
                            <MySpots key={spot.id} spot={spot}></MySpots>
                        ))
                    } */}
                    {spotsArr.map((spot) => (
                        <div>
                        <Link
                            style={{ textDecoration: "none", color: "black" }}
                            to={`/spots/${spot.id}`}
                        >
                            <div className="allspots-spot-image-container">
                                {spot.previewImage ? (
                                    <div>
                                        <img src={spot.previewImage} />
                                    </div>
                                ) : (
                                    <div>
                                        <img src={noimage} alt="noimage" />
                                    </div>
                                )}
                            </div>

                            <div className="allspots-spot-info">
                                <div className="allspots-spot-header">
                                    <div className="allspots-spot-location">
                                        {spot.city}, {spot.state}
                                    </div>

                                    <div className="allspots-spot-rating">
                                        {Number(spot.avgRating) ? (
                                            <span>★ {spot.avgRating}</span>
                                        ) : (
                                            <span>★ None</span>
                                        )}
                                    </div>
                                </div>
                                <div className="allspots-spot-country">{spot.country}</div>
                                <div className="allspots-spot-price">
                                    ${spot.price} <span>night</span>
                                </div>
                            </div>
                        </Link>

                            <div className="myspots-buttons-container">
                                {(
                                    <>
                                        <button className="myspots-buttons" onClick={(e) => history.push(`/myspots/edit/${spot.id}`)}>
                                            Edit Spot
                                        </button>

                                        <button className="myspots-buttons" onClick={(e) => dispatch(deleteSpotThunk(Number(spot.id))).then(history.push('/myspots'))}>
                                        Delete Spot
                                        </button>
                                    </>
                                )}
                            </div>

                    </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default LoadUserSpots
