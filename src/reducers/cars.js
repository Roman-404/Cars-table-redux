import * as actionTypes from '../actionTypes';


// CARS REDUCER
const initState = {
    cars: [],
    cars_loading: true,
    x_total_count: 0
};

const carsData = (state=initState, action) => {
    switch (action.type) {
        case actionTypes.CARS_LOADED:
            return {
                cars: action.cars,
                cars_loading: false,
                x_total_count: +action.x_total_count
            }
        default:
            return state;
    };
};

export default carsData;