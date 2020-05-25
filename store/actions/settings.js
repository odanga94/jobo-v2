import { database as firebaseDatabase } from 'firebase';

export const SET_SETTINGS = "SET_SETTINGS";

export const fetchSettings = () => {
    return async dispatch => {
         await firebaseDatabase().ref('settings').once('value', dataSnapshot => {
            const { promotionalMessage, connectionFee } = dataSnapshot.val();
            dispatch({
                type: SET_SETTINGS,
                promotionalMessage,
                connectionFee: parseInt(connectionFee)
            });
         })
    }
}