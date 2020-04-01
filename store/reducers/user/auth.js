import { AUTHENTICATE, LOG_OUT } from '../../actions/user/auth';

const initialState = {
    userId: null,
    isFacebookUser: false,
}

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case AUTHENTICATE:
            return {
                userId: action.userId,
                isFacebookUser: action.isFacebookUser ? action.isFacebookUser : false
            }
        case LOG_OUT:
            return initialState
        default:
            return state;
    }
}

export default authReducer;