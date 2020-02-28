import { USER_LOCATION } from '../actions/location';

const initialState = {
    userLocation: null
}

export default (state = initialState, action) => {
    switch (action.type){
        case USER_LOCATION:
            return {
                userLocation: action.userLocation
            }
        default:
            return state;
    }
}