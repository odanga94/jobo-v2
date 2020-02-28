import * as firebase from 'firebase';

export const FETCH_PROFILE = "FETCH_PROFILE";
export const EDIT_PROFILE = "EDIT_PROFILE";
export const UPDATE_IMAGE = "UPDATE_IMAGE";
export const DELETE_IMAGE = "DELETE_IMAGE";

export const fetchProfile = (uid) => {
    return async dispatch => {
        try {
            const dataSnapshot = await firebase.database().ref(`user_profiles/${uid}`).once('value');
            const profileData = dataSnapshot.val();
            dispatch({
                type: FETCH_PROFILE,
                profileData,
            })
            return profileData;
        } catch (err) {
            throw new Error(err);
        }
    }

}

const uploadImage = async (imageUri, uid) => {
    try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = firebase.storage().ref(`images/${uid}/profilePic.jpg`);
        await imageRef.put(blob);
        const downloadUrl = await imageRef.getDownloadURL();
        return downloadUrl
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

export const editProfile = (uid, userData) => {
    return async dispatch => {
        try {
            const userProfileRef = firebase.database().ref(`user_profiles/${uid}`);
            await userProfileRef.update({ name: userData.name, phone: userData.phone })
                .then(() => {
                    dispatch({
                        type: EDIT_PROFILE,
                        userData
                    });
                });
            if (userData.imageUri){
                const firebaseImageUri = await uploadImage(userData.imageUri, uid);
                await userProfileRef.update({ profilePic: firebaseImageUri });
                dispatch({
                    type: UPDATE_IMAGE,
                    imageUri: firebaseImageUri
                })
            }
        } catch (err) {
            throw new Error(err);
        }
    }
}

export const deleteProfilePic = (uid) => {
    return async dispatch => {
        try {
            const imageRef = firebase.storage().ref(`images/${uid}/profilePic.jpg`);
            const userProfileRef = firebase.database().ref(`user_profiles/${uid}`);
            await imageRef.delete();
            await userProfileRef.update({ profilePic: "" });
            dispatch({
                type: DELETE_IMAGE,
            });
        } catch(err) {
            console.log(err);
            throw new Error(err);
        }
    }
}
