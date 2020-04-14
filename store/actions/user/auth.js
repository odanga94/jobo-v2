import * as firebase from 'firebase';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOG_OUT = 'LOG_OUT';

export const authenticate = (userId, isFacebookUser, isGoogleUser) => {
    return dispatch =>  {
        dispatch({
            type: AUTHENTICATE,
            userId,
            isFacebookUser: isFacebookUser,
            isGoogleUser: isGoogleUser
        });
    }
}

export const signUp = (email, password, name, phone) => {
    return async dispatch => {
        try {
            const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const date = new Date().toString()
            await firebase.database().ref(`user_profiles/${response.user.uid}`)
                .set({
                    name: name,
                    phone: phone,
                    created_At: date
                }).then((res) => {
                    //console.log(res);
                    dispatch(authenticate(response.user.uid));
                }).catch(err => {
                    throw new Error(err);
                })        
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
