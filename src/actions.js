import * as actionTypes from './actionTypes';
import axios from 'axios';


export const getCars = value => {
    return {
        type: actionTypes.CARS_LOADED,
        cars: value.cars,
        x_total_count: value.x_total_count
    };
};

export const getDealers = value => {
    return {
        type: actionTypes.DEALERS_LOADED,
        payload: value
    };
};

export const setNewDealers = value => {
    return {
        type: actionTypes.UPDATE_DEALERS,
        payload: value
    };
};

export const getNewDealers = async id => {
   try{
        const response = await axios.get(`https://jlrc.dev.perx.ru/carstock/api/v1/dealers/${id}`)
        const dealer = response.data
        return dealer
    }
    catch(error){
        return console.log(error)
    };
};

export const createDealer = value => {
    return {
        id: value.id,
        name: value.name,
        email: value.url
    };
};

export const updateDealersData = (page, per_page, dealers) => {
    return dispatch => {
        axios.get("https://jlrc.dev.perx.ru/carstock/api/v1/vehicles/?state=active&hidden=false&group=new", {
            headers: {'X-CS-Dealer-Id-Only' : '1'},
            params: {
                page: page,
                per_page: per_page
            }
        })
        .then(response => {
            return {
                data: response.data,
                dealers: dealers
            }
        })
        .then(response => {
            const data = response.data
            const dealers = response.dealers
            const cars_dealers_id = data.map(value => value.dealer)
            const dealers_id = dealers.map(value => value.id)
            const filter_dealers = dealers_id.filter(i => !cars_dealers_id
                .includes(i)).concat(cars_dealers_id.filter(i => !dealers_id.includes(i)));
            const new_dealers_id = [...new Set([...filter_dealers, ...cars_dealers_id])].filter(e => e != null)

            if (new_dealers_id) {
                Promise.all(new_dealers_id.map(id => getNewDealers(id))).then(
                    response => {
                        const new_dealers = response.map(e => createDealer(e))
                        return new_dealers
                    }
                ).then(response => {
                dispatch(setNewDealers(response));
                })
            }
        })
        .catch(error => console.log(error));
    };
};

export const loadDealersData = (x_total_count) => {
    return dispatch => {
        axios.get("https://jlrc.dev.perx.ru/carstock/api/v1/vehicles/?state=active&hidden=false&group=new", {
            headers: {'X-CS-Dealer-Id-Only' : '1'},
            params: { per_page: x_total_count }
        })
        .then(async response => {
            const data = response.data
            const id = data.map(value => value.dealer).filter(e => e !== null)
            const url = `https://jlrc.dev.perx.ru/carstock/api/v1/dealers/?id__in=${id}`
            const dealers = await axios.get(url)
                return dealers.data.map(e => createDealer(e))
        })
        .then(response => {
                dispatch(getDealers(response));
        })
        .catch(error => console.log(error));
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
        dealer: dealers[0] === undefined ? undefined : dealers[0].find(e => e.id === car.dealer)
    };
};

export const loadCarsData = (page, per_page, dealers) => {
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
        .then(response => {
            const data = response[0]
            const x_total_count = response[1]
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