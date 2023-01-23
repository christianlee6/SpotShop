import React, { useEffect } from "react"
import { Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getUserReviewsThunk } from "../../store/reviews"
import MyReviews from "./MyReviews"
import './Reviews.css'


const LoadUserReviews = ({  }) => {
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user)
    const userReviewsObj = useSelector((state) => state.reviews.user)
    const userReviewsArr = Object.values(userReviewsObj)

    useEffect(() => {
        dispatch(getUserReviewsThunk())
    }, [dispatch])

    if (!sessionUser) return <Redirect to="/" />

    return (
        <>
            <div className="myreviews-header">
                {userReviewsArr.length === 0 ? (<><h1>My Reviews</h1>
                <h4>Oops! It looks like you don't have any reviews.</h4></>):(<h1>My Reviews</h1>)}
            </div>

            <div className="wrapper-center">
                <div className="myreviews-container">
                    {
                        <div className="myreviews-wrapper-wrapper">
                            <div className="myreviews-wrapper">
                                {userReviewsArr.map((review) => (
                                    <MyReviews key={review.id} review={review}/>
                                ))}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default LoadUserReviews;
