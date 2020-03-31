import Order from '../../models/order';
import { ADD_ORDER, SET_ORDERS, UPDATE_ORDER } from '../actions/orders';

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
                        action.orderId,
                        action.orderDetails
                    ),
                )
            }
        case UPDATE_ORDER:
            let indexOfOrderToUpdate;
            const orderToUpdate = state.orders.find((order, index) => {
                if (order.id === action.orderId){
                    indexOfOrderToUpdate = index;
                    return true;
                }
            });
            //console.log(orderToUpdate);
            const updatedOrder = new Order(
                action.orderId,
                {
                    ...orderToUpdate.orderDetails,
                    [action.valueToUpdate]: action.value
                }
            )
            //console.log(updatedOrder);
            const updatedOrders = [...state.orders];
            updatedOrders.splice(indexOfOrderToUpdate, 1, updatedOrder);
            return {
                ...state,
                orders: updatedOrders
            }
        case SET_ORDERS:
            return {
                ...state,
                orders: action.orders
            }
    }
    return state;
}