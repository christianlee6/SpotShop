import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotReviewsThunk } from "../../store/reviews";
import './Reviews.css'

const LoadSpotReviews = ({ spotId }) => {
    const dispatch = useDispatch();
    const reviewsObj = useSelector((state) => {
        return state.reviews.spot;
    });

    const reviewsArr = Object.values(reviewsObj);

    useEffect(() => {
        dispatch(getSpotReviewsThunk(+spotId));
    }, [dispatch]);

    if (!reviewsArr.length) return null;
    return (
        <>
        {
          reviewsArr.map((review) => (
              <div className="single-review">
              <h3>{review.User.firstName}{" "}{review.User.lastName}</h3>
              <p className="single-review-date">
                {new Date(review.createdAt).toString().slice(3,-42)}
              </p>

              <p className="single-review-stars">
                {
                  [...Array(review.stars)].map((star) => (<i className="fa-solid fa-star"></i>))
                }
              </p>

              <p className="single-review-review">
                <i className="fa fa-quote-left fa-lg" aria-hidden="true"></i>
                <span>
                  {review.review}
                </span>
                <i className="fa fa-quote-right fa-lg" aria-hidden="true"></i>
              </p>
              <div>
                {
                    review.ReviewImages &&
                    review.ReviewImages.map((image) => {
                        if (image.url === "") return
                    return (
                      <img
                      className="single-review-image"
                      src={image.url} />
                    )
                  })
                }
              </div>
            </div>
          ))
        }
        </>
      )
    }

export default LoadSpotReviews;
