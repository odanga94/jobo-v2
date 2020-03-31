import * as firebase from 'firebase';

import Order from '../../models/order';
import { uploadImage } from '../../utility/functions';
import * as currentJobActions from './currentJob';

export const ADD_ORDER = 'ADD_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
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
                    { ...resData[key] }
                );
            }) : [];
            loadedOrders.sort((a, b) => a.orderDetails.dateRequested > b.orderDetails.dateRequested ? -1 : 1)
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

export const addOrder = (userId, orderDetails, imageUri) => {
    return async (dispatch) => {
        let orderId;
        try {
            const orderRef = await firebase.database().ref(`orders/${userId}`).push(orderDetails);
            const orderRefArray = orderRef.toString().split('/');
            orderId = orderRefArray[orderRefArray.length - 1];
            //console.log('[ORDER_ID]', orderId);
            await dispatch(currentJobActions.addCurrentJob(orderId));
            dispatch({
                type: ADD_ORDER,
                orderDetails,
                orderId
            });
        } catch(err){
            console.log(err);
            throw new Error('Something went wrong 😞');
        }
        if(imageUri){
            try {
                const firebaseImageUri = await uploadImage(imageUri, `images/${userId}/orders/${orderId}/problemImage.jpg`);
                await firebase.database().ref(`orders/${userId}/${orderId}`).update({ problemImage: firebaseImageUri });
            } catch(err){
                throw new Error('Error uploading image but your order was successful.');
            }
        }
    }
}