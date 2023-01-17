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

export const getAllSpots = () => async (dispatch) => {
    const response = await fetch("/api/spots");

    if (response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots));
    }
};

const initialState = { allSpots: {}, singleSpot: {} };

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD:
            newState = { ...state, allSpots: { ...state.allSpots } };
            action.spots.Spots.forEach((spot) => {
                newState.allSpots[spot.id] = spot;
            });
            return newState;

        default:
            return state;
    }
};

export default spotsReducer;
