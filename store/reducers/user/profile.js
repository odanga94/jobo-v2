import { FETCH_PROFILE, EDIT_PROFILE, UPDATE_IMAGE} from '../../actions/user/profile';

const initialState = {
    name: "",
    phone: "",
    imageUri: ""
}

export default (state = initialState, action) => {
    switch (action.type){
        case FETCH_PROFILE:
            return {
                name: action.profileData.name,
                phone: action.profileData.phone,
                imageUri: action.profileData.profilePic
            }
        case EDIT_PROFILE:
            return {
                ...state,
                name: action.userData.name,
                phone: action.userData.phone
            }
        case UPDATE_IMAGE:
            return {
                ...state,
                imageUri: action.imageUri
            }
        default:
            return state
    }
}