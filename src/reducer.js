import * as actionTypes from './actionTypes';

const initState = {
    cars: [],
    cars_loading: true
};

const reducer = (state=initState, action) => {
    switch (action.type) {
        case actionTypes.CARS_LOADED:
            return {
                cars: action.payload,
                cars_loading: false
            }
        default:
            return state;
    };
};

export default reducer;