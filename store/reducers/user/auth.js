import { AUTHENTICATE, LOG_OUT } from '../../actions/user/auth';

const initialState = {
    userId: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case AUTHENTICATE:
            return {
                userId: action.userId
            }
        case LOG_OUT:
            return initialState
        default:
            return state;
    }
}

export default authReducer;