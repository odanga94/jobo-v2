import { 
    FETCH_PROFILE, 
    EDIT_PROFILE, 
    UPDATE_IMAGE, 
    DELETE_IMAGE,
    HAS_ORDERS
} from '../../actions/user/profile';

const initialState = {
    name: "",
    phone: "",
    imageUri: "",
    hasOrders: true
}

export default (state = initialState, action) => {
    switch (action.type){
        case FETCH_PROFILE:
            if(action.profileData){
                return {
                    ...state,
                    name: action.profileData.name,
                    phone: action.profileData.phone,
                    imageUri: action.profileData.profilePic
                }
            }
            return state
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
        case DELETE_IMAGE: 
            return {
                ...state,
                imageUri: ""
            }
        case HAS_ORDERS:
            return {
                ...state,
                hasOrders: action.hasOrders
            }
        default:
            return state
    }
}