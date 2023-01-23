import { csrfFetch } from "./csrf";

const CREATE_REVIEW = "reviews/CREATE";
const UPDATE_REVIEW = "reviews/UPDATE_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";
const LOAD_SPOT_REVIEWS = "reviews/LOAD_SPOT_REVIEWS";
const LOAD_USER_REVIEWS = "reviews/LOAD_USER_REVIEWS";
const ADD_REVIEW_IMAGE = "reviews/ADD_REVIEW_IMAGE";

const loadSpotReviews = (reviews) => {
    return {
        type: LOAD_SPOT_REVIEWS,
        reviews,
    };
};

const loadUserReviews = (reviews) => {
    return {
        type: LOAD_USER_REVIEWS,
        reviews,
    };
};

const createReview = (review) => {
    return {
        type: CREATE_REVIEW,
        review,
    };
};

const updateReview = (review) => {
    return {
        type: UPDATE_REVIEW,
        review,
    };
};

const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId,
    };
};

const addReviewImage = (image, reviewId) => {
    return {
        type: ADD_REVIEW_IMAGE,
        image,
        reviewId,
    };
};

export const getSpotReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const data = await response.json();
        const reviewsArr = data.Reviews;
        dispatch(loadSpotReviews(reviewsArr));
        return data;
    }
};

export const getUserReviewsThunk = () => async (dispatch) => {
    const response = await csrfFetch("/api/reviews/current");

    if (response.ok) {
        const data = await response.json();
        const reviewsArr = data.Reviews;
        dispatch(loadUserReviews(reviewsArr));
        return data;
    }
};

export const createNewReviewThunk =
    (newReview, spotId, user) => async (dispatch) => {
        console.log("SPOTID:", newReview)

        let { review, stars } = newReview
        console.log("NEWREVIEW NO URL:", newReview)
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newReview),
        });

        if (response.ok) {
            const newReview = await response.json();

            const userInfo = {};
            userInfo.id = user.id;
            userInfo.firstName = user.firstName;
            userInfo.lastName = user.lastName;

            newReview.User = userInfo;
            newReview.ReviewImages = [];

            dispatch(createReview(newReview));
            return newReview;
        } else {
            const result = await response.json();
            return result;
        }
    };

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(deleteReview(reviewId));
    }
};

export const addReviewImageThunk = (reviewId, imageObj) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageObj),
    });

    if (response.ok) {
        const image = await response.json();
        dispatch(addReviewImage(image, reviewId));
        return image;
    }
};

const initialState = { spot: {}, user: {} };

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_SPOT_REVIEWS:
            newState = { ...state };
            const normalizedReviews = {};
            action.reviews.forEach(
                (review) => (normalizedReviews[review.id] = review)
            );
            newState.spot = normalizedReviews;
            newState.user = {};
            return newState;

        case LOAD_USER_REVIEWS:
            newState = {...state}
            const normalizedUserReviews = {};
            action.reviews.forEach((review) => (normalizedUserReviews[review.id] = review))
            newState.user = normalizedUserReviews
            newState.spot = {}
            return newState

        case CREATE_REVIEW:
            newState = {...state}
            newState.user = {...state.user}
            newState.spot = {...state.spot, [action.review.id]: action.review}
            return newState

        case DELETE_REVIEW:
            newState = {...state}
            newState.spot = {...state.spot}
            newState.user = {...state.user}
            delete newState.spot[action.reviewId]
            delete newState.user[action.reviewId]
            return newState

        case ADD_REVIEW_IMAGE:
            newState = {...state}
            newState.spot = {...state.spot}
            newState.user = {...state.user}
            newState.spot[action.reviewId].ReviewImages = [action.image]
            return newState
        default:
            return state;
    }
};

export default reviewsReducer;
