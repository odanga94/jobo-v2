import Order from '../../models/order';
import { ADD_ORDER, SET_ORDERS } from '../actions/orders';

const initialState = {
    orders: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_ORDER:
            return {
                ...state,
                orders: state.orders.concat(
                    new Order(
                        action.orderData.orderId,
                        action.orderData.problemName,
                        action.orderData.service,
                        action.orderData.totalAmount,
                        action.orderData.date,
                        action.orderData.proName,
                        action.orderData.proImage,
                        action.orderData.clientAddress,
                        action.orderData.mapImage
                    ),
                )
            }
        case SET_ORDERS:
            return {
                ...state,
                orders: action.orders
            }
    }
    return state;
}