import { IS_AUTH } from '../actions/auth';

const initialState = {
    isAuth: true
}

const authReducer = (state = initialState, action) => {
    return {
        ...state
    }
}

export default authReducer;