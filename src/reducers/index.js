import { combineReducers } from 'redux'
import carsData from './cars'
import dealersData from './dealers'

export default combineReducers({
    carsData,
    dealersData
});