import * as firebase from 'firebase';

export const SET_CURRENT_JOB = "SET_CURRENT_JOB";

export const addCurrentJob = (orderId) => {
    return async (dispatch, getState) => {
        const { userId } = getState().auth;
        try {
            await firebase.database().ref(`pending_jobs/${userId}`).set({ currentJobOrderId: orderId });
            dispatch({
                type: SET_CURRENT_JOB,
                currentJobOrderId: orderId
            });
        } catch (err) {
            console.log(err);
            throw new Error('Something went wrong 😞');
        }
        
    }
}
