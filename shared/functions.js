import ENV from '../env';
import * as firebase from 'firebase';

//add form reducer as well

export const fetchAddress = async (lat, lng) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${ENV.googleApiKey}`);
    if (!response.ok){
        throw new Error('Unable to get your location. Check your internet connection.');
    }
    const resData = await response.json();
    //console.log('resData', resData)
    if(!resData.results){
        throw new Error('Something went wrong');
    }
    return resData.results[0].formatted_address;
}

export const uploadImage = async (imageUri, firebaseLocation) => {
    try {
        //console.log(imageUri);
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = firebase.storage().ref(firebaseLocation);
        await imageRef.put(blob);
        const downloadUrl = await imageRef.getDownloadURL();
        return downloadUrl
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}