import * as firebase from 'firebase';

import Order from '../../models/order';
import ENV from '../../env';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = (userId) => {
    return async dispatch => {
        try {
            const dataSnapshot = await firebase.database().ref(`orders/${userId}`).once('value');
            const resData = dataSnapshot.val();
            //console.log(resData);

            const loadedOrders = resData ? Object.keys(resData).map(key => {
                return new Order(
                    key,
                    resData[key].problemName,
                    resData[key].service,
                    resData[key].totalAmount,
                    new Date(resData[key].date),
                    resData[key].proName,
                    resData[key].proImage,
                    resData[key].clientAddress,
                    resData[key].clientLocation
                );
            }) : [];
            loadedOrders.sort((a, b) => a.date > b.date ? -1 : 1)
            //console.log(loadedOrders);*/
            dispatch({
                type: SET_ORDERS,
                orders: loadedOrders
            });
        } catch (err){
            console.log(err);
            throw new Error('Something went wrong 😞');
        }    
        }
}

export const addOrder = (userId, problemName, service, totalAmount, proName, proImage, clientLocation) => {
    return async (dispatch) => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${clientLocation.lat},${clientLocation.lng}&key=${ENV.googleApiKey}`);
        if (!response.ok){
            throw new Error('Something went wrong 😞');
        }
        const resData = await response.json();
        if(!resData.results){
            throw new Error('Something went wrong 😞');
        }
        const address = resData.results[0].formatted_address;
        const date = new Date().toString();
        let orderId;
        firebase.database().ref(`orders/${userId}`).push({
            problemName,
            service,
            totalAmount,
            date,
            proName,
            proImage,
            clientAddress: address,
            clientLocation
        }).then(res => {
            const resArray = res.toString().split('/');
            orderId = resArray[resArray.length - 1];
            console.log('[ORDER_ID]', orderId);
        }).catch(err => {
            console.log(err);
            throw new Error('Something went wrong 😞');
        })

        dispatch({
            type: ADD_ORDER,
            orderData: {
                orderId,
                problemName,
                service,
                totalAmount,
                date,
                proName,
                proImage,
                clientAddress: address,
                clientLocation
            }
        });
    }
}