import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Redirect } from "react-router-dom"
import { getSpotsOfUserThunk, resetSpots } from "../../store/spots"
import MySpots from "./MySpots"
import './Spots.css'

const LoadUserSpots = () => {
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user)
    const spotsObj = useSelector((state) => state.spots.allSpots)
    const spotsArr = Object.values(spotsObj)

    useEffect(() => {
        dispatch(getSpotsOfUserThunk())

        return () => {
            dispatch(resetSpots())
        }
    }, [dispatch])

    if (!sessionUser) return <Redirect to="/"/>

    return (
        <>
            <div className="myspots-header">
                {
                    spotsArr.length === 0 ? (<><h1>My Spots</h1><h4>Oops! It looks like you don't have any spots</h4></>) : (<h1>My Spots</h1>)
                }
            </div>

            <div className="wrapper-center">
                <div className="allspots-container myspots">
                    {
                        spotsArr.map((spot) => (
                            <MySpots key={spot.id} spot={spot}></MySpots>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default LoadUserSpots
