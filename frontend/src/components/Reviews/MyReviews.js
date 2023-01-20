import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteReviewThunk, getUserReviewsThunk } from "../../store/reviews";
import { Link } from "react-router-dom";
import './Reviews.css'

const MyReviews = ({ review }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserReviewsThunk(review.spotId))
    }, [dispatch])

    const deleteReviewHandleClick = async () => {
        if (
            window.confirm(
                "Are you sure you want to delete this spot? This action is irreversible."
            )
        ) {
            dispatch(deleteReviewThunk(review.id));
        }
    };

    return (
        <div className="myreview-wrapper">
            <div className="myreview-header">
                Review For {" "}
                <Link
                    to={`/spots/${review.Spot.id}`}
                    style={{ textDecoration: "none", color: "red" }}
                >
                    {review.Spot.name}
                </Link>
                :
            </div>

            <div className="myreview-details">
                <p className="myreview-date">
                    {new Date(review.createdAt).toString().slice(3, -42)}
                </p>

                <div className="myreview-star-rating">
                    {[...Array(review.stars)].map((star) => (
                        <i className="fa-solid fa-star"></i>
                    ))}
                </div>

                <div className="myreview-text">
                    <p>{review.review}</p>
                </div>

                <div>
                    <button
                        onClick={deleteReviewHandleClick}
                        className="myreview-button"
                    >
                        Delete Review
                    </button>
                </div>

                <div>
                    {
                        review.ReviewImages.length > 0 && <div>
                            <p>
                                Images:
                            </p>
                            <div>
                                {review.ReviewImages.map((image) => {
                                    return (
                                        <div className="myreview-image-wrapper">
                                            <img src={image.url} className="myreview-image"/>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default MyReviews;
