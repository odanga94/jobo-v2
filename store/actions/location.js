export const USER_LOCATION = "USER_LOCATION";

export const setUserLocation = (location) => {
    return {
        type: USER_LOCATION,
        userLocation: location
    }
}