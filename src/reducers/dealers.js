import * as actionTypes from '../actionTypes';


// DEALERS REDUCER
const initState = {
    dealers: []
};

const dealersData = (state=initState, action) => {
    switch (action.type) {
        case actionTypes.DEALERS_LOADED:
            return {
                dealers: action.payload,
            }
        case actionTypes.UPDATE_DEALERS:
            return {
                dealers: filterDealers([...state.dealers, ...action.payload])
            }
        default:
            return state;
    };
};

export const filterDealers = dealers => {
    return  Array.from(dealers.reduce((m, t) => m.set(t.id, t), new Map()).values())
}

export default dealersData;