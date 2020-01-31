import Order from '../../models/order';
import * as firebase from 'firebase';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async dispatch => {
            const dataSnapshot = await firebase.database().ref('orders/u1').once('value');
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
                    resData[key].mapImage
                );
            }) : [];
            loadedOrders.sort((a, b) => a.date > b.date ? -1 : 1)
            //console.log(loadedOrders);*/
            dispatch({
                type: SET_ORDERS,
                orders: loadedOrders
            })
        } 
}

export const addOrder = (problemName, service, totalAmount, proName, proImage, clientAddress, mapImage) => {
    return async (dispatch) => {
        const date = new Date().toISOString();
        let orderId;
        firebase.database().ref('orders/u1').push({
            problemName,
            service,
            totalAmount,
            date,
            proName,
            proImage,
            clientAddress,
            mapImage
        }).then(res => {
            const resArray = res.toString().split('/');
            orderId = resArray[resArray.length - 1];
            console.log('[ORDER_ID]', orderId);
        }).catch(err => {
            console.log(err);
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
                clientAddress,
                mapImage
            }
        });
    }
}