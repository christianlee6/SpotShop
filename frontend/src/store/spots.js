import { csrfFetch } from "./csrf";

const LOAD_ALL_SPOTS = "spots/LOAD_ALL_SPOTS";
const LOAD_USER_SPOTS = "spots/LOAD_USER_SPOTS"
const LOAD_SINGLE_SPOT = "spots/LOAD_SINGLE_SPOT";
const CREATE_SPOT = "spots/CREATE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";
const ADD_SPOT_IMAGE = "spots/ADD_SPOT_IMAGE"
const RESET_SPOTS = "spots/RESET_SPOTS";

const loadAllSpots = (spots) => {
    return {
        type: LOAD_ALL_SPOTS,
        spots,
    };
};

const loadUserSpots = (spots) => {
    return {
        type: LOAD_USER_SPOTS,
        spots
    }
}

const loadSingleSpot = (spot) => {
    return {
        type: LOAD_SINGLE_SPOT,
        spot
    }
}

const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        spot,
    };
};

const updateSpot = (spot) => {
    return {
        type: UPDATE_SPOT,
        spot,
    };
};

const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId,
    };
};

const addSpotImage = (image) => {
    return {
        type: ADD_SPOT_IMAGE,
        image
    }
}

export const resetSpots = () => {
    return {
        type: RESET_SPOTS,
    };
};

export const getAllSpotsThunk = () => async (dispatch) => {
    const response = await fetch("/api/spots");

    if (response.ok) {
        const spots = await response.json();
        dispatch(loadAllSpots(spots))
    }
};

export const getSpotsOfUserThunk = () => async (dispatch) => {
    const response = await fetch("/api/spots/current");

    if (response.ok) {
        const spots = await response.json();
        dispatch(loadUserSpots(spots));
    }
};

export const getOneSpotThunk = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadSingleSpot(spot));
    }
};

export const createSpotThunk = (spotInfo, imageInfo) => async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spotInfo),
    });

    if (response.ok) {
        const newSpot = await response.json();
        dispatch(createSpot(newSpot))
        return newSpot
    }
};

export const editSpotThunk =
    (mySpot, spotId) => async (dispatch) => {
        const response = await csrfFetch(`/api/spots/${spotId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mySpot),
        });

        if (response.ok) {
            const spot = await response.json();
            dispatch(updateSpot(spot))
            return spot
        }
    };

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(deleteSpot(spotId))
    }
};

export const addSpotImageThunk = (spotId, imageObj) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(imageObj)
    })

    if (response.ok) {
        const image = await response.json()
        dispatch(addSpotImage(image))
        return image
    }
}

const initialState = { allSpots: {}, singleSpot: {} };

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_ALL_SPOTS:
            newState = { allSpots: {}, singleSpot: {}}
            const normalizedSpots = {}
            action.spots.Spots.forEach((spot) => normalizedSpots[spot.id] = spot)
            newState.allSpots = normalizedSpots
            return newState

        case LOAD_USER_SPOTS:
            newState = {allSpots: {}, singleSpot: {}}
            const normalizedUserSpots = {}
            action.spots.Spots.forEach((spot) => normalizedUserSpots[spot.id] = spot)
            newState.allSpots = normalizedUserSpots
            return newState

        case LOAD_SINGLE_SPOT:
            newState = { allSpots: {}, singleSpot: {}}
            newState.singleSpot = action.spot
            return newState

        case CREATE_SPOT:
            newState = {...state}
            newState.allSpots = {...state.allSpots, [action.spot.id]: action.spot}
            return newState

        case UPDATE_SPOT:
            newState = {...state}
            const updatedSpot = {...newState.allSpots[action.spot.id], ...action.spot}
            newState.singleSpot = {...state.singleSpot, ...updateSpot}
            newState.allSpots = {...state.allSpots, [action.spot.id]: updatedSpot}
            return newState

        case DELETE_SPOT:
            newState = {...state}
            newState.allSpots = {...state.singleSpot}
            delete newState.allSpots[action.spotId]
            if (newState.singleSpot.id === action.spotId) newState.singleSpot = {}
            return newState

        case ADD_SPOT_IMAGE:
            newState = {...state}
            newState.allSpots = {...state.allSpots}
            newState.singleSpot = {...state.singleSpot}
            newState.singleSpot.SpotImages = [action.image]
            return newState

        case RESET_SPOTS:
            newState = {...state}
                newState.allSpots = {}
            return newState

        default:
            return state;
    }
};

export default spotsReducer;
