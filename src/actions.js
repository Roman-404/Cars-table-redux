import * as actionTypes from './actionTypes';
import axios from 'axios';


export const getCars = value => {
    return {
        type: actionTypes.CARS_LOADED,
        cars: value.cars,
        x_total_count: value.x_total_count
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
        const id = values.map(value => value.dealer).filter(e => e !== null)
        const url = `https://jlrc.dev.perx.ru/carstock/api/v1/dealers/?id__in=${id}`
        const response = await axios.get(url)
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
        dealer: dealers[0] == undefined ? {} : dealers[0].find(e => e.id === car.dealer)
    };
};

export const loadCarsData = (page, per_page) => {
    return dispatch => {
        axios.get("https://jlrc.dev.perx.ru/carstock/api/v1/vehicles/?state=active&hidden=false&group=new", {
            headers: {'X-CS-Dealer-Id-Only' : '1'},
            params: {
                page: page,
                per_page: per_page
            }
        })
        .then(response => {
            const data = [[...response.data], response.headers['x-total-count']]
            return (
                data
            )
        })
        .then(async response => {
            const data = response[0]
            const x_total_count = response[1]
            const dealers = await loadDealersData(data)
            const cars = data.map(car => mergeData(car, dealers))
              return {
                  cars: cars,
                  x_total_count: x_total_count
              }
        })
        .then(response => {
                dispatch(getCars(response));
        })
        .catch(error => console.log(error));
    };
};