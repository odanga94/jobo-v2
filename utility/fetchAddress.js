import ENV from '../env';

export default async (lat, lng) => {
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