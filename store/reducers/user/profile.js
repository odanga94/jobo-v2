import { FETCH_PROFILE } from '../../actions/user/profile';

const initialState = {
    profileData: {},
    imageUrl: ""
}

export default (state = initialState, action) => {
    switch (action.type){
        case FETCH_PROFILE:
            return {
                ...state,
                profileData: action.profileData,
                imageUrl: action.imageUrl
            }
        default:
            return state
    }
}