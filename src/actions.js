import * as actionTypes from './actionTypes';
import axios from 'axios';


export const getCars = value => {
    return {
        type: actionTypes.CARS_LOADED,
        payload: value,
    };
};

export const createDealer = value => {
    return {
        id: value.id,
        name: value.name,
        email: value.url
    };
};

export const loadDealersData = async (values) => {
    try{
        const response = await axios.get(`https://jlrc.dev.perx.ru/carstock/api/v1/dealers/?id__in=${values.map(value => value.dealer)}`)
        const data = response.data
        return data.map(e => createDealer(e))
    }
    catch(error){
        return console.log(error)
    };
};

export const mergeData = (car, ...dealers) => {
    return {
        id: car.id,
        model: car.model,
        brand: car.brand,
        grade: car.grade,
        vin: car.vin,
        images: car.images,
        dealer: dealers[0].find(e => e.id === car.dealer)
    };
};

export const loadCarsData = () => {
    return dispatch => {
        axios.get("https://jlrc.dev.perx.ru/carstock/api/v1/vehicles/?state=active&hidden=false&group=new", {
            headers: {'X-CS-Dealer-Id-Only' : '1'}
        })
        .then(response => {
            const data = response.data
            return (
                data
            )
        })
        .then(async data => {
            const dealers = await loadDealersData(data)
            const cars = data.map(car => mergeData(car, dealers))
              return cars
        })
        .then(response => {
                dispatch(getCars(response));
        })
        .catch(error => console.log(error));
    };
};