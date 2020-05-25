import { SET_SETTINGS } from '../actions/settings';

const initialState = {
    connectionFee: 200,
    promotionalMessage: ""
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_SETTINGS:
            return {
                ...state,
                connectionFee: action.connectionFee,
                promotionalMessage: action.promotionalMessage
            }
        default:
            return state;
    }
}