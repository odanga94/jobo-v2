import * as firebase from 'firebase';

import Order from '../../models/order';
import { uploadImage } from '../../shared/functions';
import { billClient } from '../../shared/mpesa';
import * as currentJobActions from './currentJob';

export const ADD_ORDER = 'ADD_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const SET_ORDERS = 'SET_ORDERS';
export const SORT_ORDERS = 'SORT_ORDERS';
export const REMOVE_ORDER = 'REMOVE_ORDER';
export const RESET_ORDERS = 'RESET_ORDERS';
export const SET_ORDER_ID_BEING_PROCESSED = 'SET_ORDER_ID_BEING_PROCESSED';
export const RESET_ORDER_ID_BEING_PROCESSED = 'RESET_ORDER_ID_BEING_PROCESSED';

const getProDetails = async (problemType, proId) => {
    const dataSnapshot = await firebase.database().ref(`pros/${problemType}/${proId}`).once('value');
    const resData = dataSnapshot.val();
    //console.log(resData);
    return resData;
}

const getProImageUrl = async (problemType, proId) => {
    let imageDownloadUrl;
    try {
        imageDownloadUrl = await firebase.storage().ref(`images/pros/${problemType}/${proId}/passport-img.jpg`).getDownloadURL();
        //console.log(imageDownloadUrl);
        return imageDownloadUrl;
    } catch (err) {
        //console.log(err.code_);
        try {
            if (err.code_ === "storage/object-not-found") {
                imageDownloadUrl = await firebase.storage().ref(`images/pros/${problemType}/${proId}/passport-img.jpeg`).getDownloadURL();
                //console.log(imageDownloadUrl);
                return imageDownloadUrl;
            }
        } catch (err) {
            if (err.code_ === "storage/object-not-found") {
                imageDownloadUrl = await firebase.storage().ref(`images/pros/${problemType}/${proId}/passport-img.png`).getDownloadURL();
                //console.log(imageDownloadUrl);
                return imageDownloadUrl;
            }
            throw new Error(err.message);
        }
    }
}

export const fetchOrders = (userId) => {
    return async (dispatch, getState) => {
        //const fetchedOrders = [];
        try {
            const dataSnapshot = await firebase.database().ref(`orders/${userId}`).once('value');
            const resData = dataSnapshot.val();
            if(!resData){
                dispatch({
                    type: SET_ORDERS,
                    orders: []
                });
                return;
            }

            const fetchedOrders = Object.keys(resData).map(orderId => {
                return new Order(
                    orderId,
                    { ...resData[orderId] }
                )
            });
            
            for (let i = fetchedOrders.length - 1; i >= 0; i--) {
                if (fetchedOrders[i].orderDetails.assignedProId) {
                    let proDetails = "";
                    let proImageUrl = "";
                    try {
                        proDetails = await getProDetails(fetchedOrders[i].orderDetails.problemType, fetchedOrders[i].orderDetails.assignedProId);
                        //console.log(proDetails)
                    } catch (err) {
                        console.log(err);
                    }
                    try {
                        proImageUrl = await getProImageUrl(fetchedOrders[i].orderDetails.problemType, fetchedOrders[i].orderDetails.assignedProId);
                        //console.log(proImageUrl)
                    } catch (err) {
                        console.log(err);
                    }
                    dispatch(
                        dispatchNewOrder(
                            fetchedOrders[i].id,
                            {
                                ...fetchedOrders[i].orderDetails,
                                proName: proDetails ? `${proDetails.firstName} ${proDetails.lastName}` : "",
                                proPhone: proDetails ? proDetails.phone : "",
                                proImage: proImageUrl ? proImageUrl : ""
                            },
                            "fetch orders" 
                        )
                    );
                    
                } else {
                    dispatch(
                        dispatchNewOrder( 
                            fetchedOrders[i].id,
                            {
                                ...fetchedOrders[i].orderDetails,
                            },
                            "fetch orders" 
                        )
                    );

                }
            }
        } catch (err) {
            console.log(err);
            throw new Error('Something went wrong 😞');
        }
    }
}

export const dispatchNewOrder = (orderId, orderDetails, from) => {
        return {
            type: ADD_ORDER,
            orderDetails,
            orderId
        };
}

export const addOrder = (userId, orderDetails, imageUri, paymentType, clientPhone) => {
    return async (dispatch) => {
        let orderId;
        try {
            const orderRef = await firebase.database().ref(`orders/${userId}`).push(orderDetails);
            const orderRefArray = orderRef.toString().split('/');
            orderId = orderRefArray[orderRefArray.length - 1];
            //console.log('[ORDER_ID]', orderId);
            if(paymentType === "mpesa"){
                await billClient(userId, orderId, clientPhone);
            }
            dispatch(dispatchNewOrder(orderId, orderDetails, "checkout"));
            dispatch({
                type: SET_ORDER_ID_BEING_PROCESSED,
                orderId
            });
        } catch (err) {
            console.log(err);
            if(err.message = "mpesaConfigError"){
                await firebase.database().ref(`orders/${userId}/${orderId}`).remove();
                dispatch({
                    type: REMOVE_ORDER,
                    orderId
                });
            }
            throw new Error('Something went wrong 😞.  Please try again later.');
        }
        if (imageUri) {
            try {
                const firebaseImageUri = await uploadImage(imageUri, `images/${userId}/orders/${orderId}/problemImage.jpg`);
                await firebase.database().ref(`orders/${userId}/${orderId}`).update({ problemImage: firebaseImageUri });
                dispatch({
                    type: UPDATE_ORDER,
                    valueToUpdate: "problemImage",
                    value: firebaseImageUri,
                    orderId
                });
            } catch (err) {
                throw new Error('Error uploading image but your order was successful.');
            }
        }
    }
}

export const fetchProDetails = (problemType, proId, orderId) => {
    return async (dispatch) => {
        //console.log('fromFetchPro', problemType, proId, orderId);
        let proDetails = "";
        try {
            proDetails = await getProDetails(problemType, proId);
            //console.log('from fetchPro', proDetails)
        } catch (err) {
            console.log(err);
        }
        dispatch({
            type: UPDATE_ORDER,
            orderId,
            valueToUpdate: "proName",
            value: proDetails ? `${proDetails.firstName} ${proDetails.lastName}` : ""
        });
        dispatch({
            type: UPDATE_ORDER,
            orderId,
            valueToUpdate: "proPhone",
            value: proDetails ? `${proDetails.phone}` : ""
        });
        let imageDownloadUrl;
        try {
            imageDownloadUrl = await getProImageUrl(problemType, proId);
            //console.log('from fetchPro', proImageUrl)
        } catch (err) {
            console.log(err);
        }
        dispatch({
            type: UPDATE_ORDER,
            orderId,
            valueToUpdate: "proImage",
            value: imageDownloadUrl
        });

    }
}