import { csrfFetch } from "./csrf";

const CREATE = "spots/CREATE";
const SINGLE = "spots/SINGLE";
const LOAD = "spots/LOAD";
const UPDATE = "spots/UPDATE";
const DELETE = "spots/DELETE";

const createSpot = (spot) => {
    return {
        type: CREATE,
        spot,
    };
};

const loadSpots = (spots) => {
    return {
        type: LOAD,
        spots,
    };
};

const singleSpot = (spot) => {
    return {
        type: SINGLE,
        spot,
    };
};

const updateSpot = (spot) => {
    return {
        type: UPDATE,
        spot,
    };
};

const deleteSpot = (spot) => {
    return {
        type: DELETE,
        spot,
    };
};

export const createSpotThunk = (spot, spotImage) => async (dispatch) => {
    spot.lat = 30;
    spot.lng = 60;
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot),
    });

    if (response.ok) {
        const spot = await response.json();
        const imageResponse = await csrfFetch(`/api/spots/${spot.id}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spotImage),
        });

        if (imageResponse.ok) {
            const image = await imageResponse.json();
            spot.previewImage = image.url;
            dispatch(createSpot(spot));
        }
    }
};

export const getAllSpots = () => async (dispatch) => {
    const response = await fetch("/api/spots");

    if (response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots));
    }
};

export const getSpotsOfUser = () => async (dispatch) => {
    const response = await fetch("/api/spots/current");

    if (response.ok) {
        const spotsOfUser = await response.json();
        return spotsOfUser;
    }
};

export const getSpotById = (id) => async (dispatch) => {
    const response = await fetch(`/api/spots/${id}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(singleSpot(spot));
    }
};

export const updateSpotThunk =
    (id, spot, url, avgRating) => async (dispatch) => {
        const response = await csrfFetch(`/api/spots/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spot),
        });

        if (response.ok) {
            const spot = await response.json();
            spot.previewImage = url || null;
            spot.avgRating = avgRating;
            dispatch(updateSpot(spot));
            return spot;
        }
    };

export const deleteSpotThunk = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(deleteSpot(spot));
        return spot;
    }
};

const initialState = { allSpots: {}, singleSpot: {} };

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case CREATE:
            newState = { ...state, allSpots: { ...state.allSpots } };
            newState.allSpots[action.spot.id] = action.spot;
            return newState;
        case LOAD:
            newState = { ...state, allSpots: { ...state.allSpots } };
            action.spots.Spots.forEach((spot) => {
                newState.allSpots[spot.id] = spot;
            });
            return newState;
        case SINGLE:
            newState = { ...state, allSpots: { ...state.allSpots } };
            newState.singleSpot = action.spot;
            return newState;
        case UPDATE:
            newState = {...state, allSpots: {...state.allSpots}}
            newState.allSpots[action.spot.id] = action.spot
            return newState
        case DELETE:
            newState = {...state, allSpots: {...state.allSpots}}
            delete newState.allSpots[action.id]
            return newState
        default:
            return state;
    }
};

export default spotsReducer;
