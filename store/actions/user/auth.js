import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';

const API_KEY = 'AIzaSyB7A0YodCgm6OxVnGK0tH71s1W42ZogEWc';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOG_OUT = 'LOG_OUT';

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token,
        userId,
        expiryDate: expirationDate.toISOString()
    }));
};

export const authenticate = (userId) => {
    return dispatch =>  {
        dispatch({
            type: AUTHENTICATE,
            userId
        });
    }
}

export const signUp = (email, password) => {
    return async dispatch => {
        try {
            const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
            //console.log(response);
            dispatch(authenticate(response.user.uid));
        } catch (error){
            throw new Error(error);
        }
    }
}

export const logIn = (email, password) => {
    return async dispatch => {
        try {
            const response = await firebase.auth().signInWithEmailAndPassword(email, password);
            //console.log(response);
            dispatch(authenticate(response.user.uid));
        } catch (error){
            throw new Error(error);
        }
    }
}

export const logOut = () => {
    return async dispatch => {
        await firebase.auth().signOut();
        dispatch({
            type: LOG_OUT
        })
    }
}

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logOut());
        }, expirationTime)
    }
}