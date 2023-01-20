import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createNewReviewThunk, addReviewImageThunk } from "../../store/reviews";


const CreateReview = ({spotId}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);

    const [review, setReview] = useState("");
    const [stars, setStars] = useState(5);
    const [url, setUrl] = useState("");
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const createReview = (e) => setReview(e.target.value);
    const createStars = (e) => setStars(e.target.value);
    const createUrl = (e) => setUrl(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setHasSubmitted(true);

        const errorsArr = [];
        if (!review.length || review.length > 255)
            errorsArr.push(
                "Please enter a valid review less than 255 characters long"
            );
        if (
            url.length &&
            (url.length > 255 ||
                !url.includes(".jpg" || ".jpeg" || ".png" || ".gif"))
        )
            errorsArr.push(
                "Please enter a valid url less than 255 characters long"
            );

        setErrors(errorsArr);

        if (errorsArr.length) return;

        const reviewInfo = { review, stars, url };

        const newReview = await dispatch(
            createNewReviewThunk(reviewInfo, spotId, sessionUser)
        );

        const imageObj = ({ url: url });

        await dispatch(addReviewImageThunk(newReview.id, imageObj));

        clearData();

        const clearData = () => {
            setReview("")
            setStars(5)
            setUrl("")
            setErrors([])
            setHasSubmitted(false)
        };

    };

    const handleCancel = (e) => {
        e.preventDefault()
        history.push(`/spots/${spotId}`)
    }

    return (
        <div>
        <div className="review-subheader">How was your stay?</div>

        <div className="validation-errors">
          {
          hasSubmitted &&
          errors &&
          errors.map((error)=>(<div key={error}>{error}</div>))
          }
        </div>

        <form onSubmit={handleSubmit}>
        <div className="form-input-wrapper">



              <label className="review-field">
                Rating:&nbsp;
                <select
                  type="number"
                  value={stars}
                  onChange={(e) => setStars(e.target.value)}
                >
                  {[1,2,3,4,5].map((num)=>(<option>{num}</option>))}
                </select>
              </label>
              <div className="form-input-break"></div>
              <label className="review-field">
                Review:
                <textarea
                  type="text"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </label>
              <div className="form-input-break"></div>
              <label className="review-field">
                Image URL:
                <input
                  type="text"
                  value={url}
                  placeholder="(optional)"
                  onChange={(e) => setUrl(e.target.value)}
                />
              </label>
          </div>

          <button
          className="review-submit-button"
          >
            Create Review
          </button>
          <button onClick={handleCancel} className="review-submit-button">
            Cancel
          </button >

        </form>

      </div>
    );
};

export default CreateReview;
