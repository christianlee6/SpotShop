import { csrfFetch } from "./csrf";
import { getAllSpots, getSpotById } from "./spots";

const CREATE = 'reviews/CREATE'
const SPOT = 'reviews/SPOT'
const UPDATE = 'reviews/SPOT'
const DELETE = 'reviews/DELETE'
const USER = 'reviews/USER'

const loadSpotReviews = (reviews) => {
    return {
        type: SPOT,
        reviews
    }
}

export const getSpotReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (response.ok) {
        const reviews = response.json()
        dispatch(loadSpotReviews(reviews))
    }
}

const initialState = { spot: {}, user: {} }

const reviewReducer = (state = initialState, action) => {
    let newState;
    console.log("!!!",action.reviews)
    switch(action.type) {
        case SPOT:
            newState = {...state, spot: {}}
            action.reviews.Reviews.forEach(review => {
                newState.spot[review.id] = review
            });
            return newState
        default:
            return state
    }
}

export default reviewReducer
