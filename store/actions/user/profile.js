import * as firebase from 'firebase';

export const FETCH_PROFILE = "FETCH_PROFILE";

export const fetchProfile = (uid) => {
    return async dispatch => {
        try {
            const dataSnapshot = await firebase.database().ref(`user_profiles/${uid}`).once('value');
            const profileData = dataSnapshot.val();
            const imageUrl = "https://firebasestorage.googleapis.com/v0/b/jobo-3a84b.appspot.com/o/proPic.jpg?alt=media&token=63fe6e15-9529-432b-b6e5-74d792b5211d"
            dispatch({
                type: FETCH_PROFILE,
                profileData,
                imageUrl
            })
        } catch (err){
            throw new Error(err);
        }  
    }
     
}
