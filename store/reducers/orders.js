import Order from '../../models/order';
import { ADD_ORDER, SET_ORDERS, UPDATE_ORDER, SORT_ORDERS } from '../actions/orders';

const initialState = {
    orders: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_ORDER:
            let newOrders = state.orders;
            if(!state.orders.find(order => order.id === action.orderId)){
                newOrders = state.orders.concat(
                    new Order(
                        action.orderId,
                        action.orderDetails
                    ),
                ); 
            } 
            return {
                orders: newOrders
            }
        case UPDATE_ORDER:
            let indexOfOrderToUpdate;
            const orderToUpdate = state.orders.find((order, index) => {
                if (order.id === action.orderId){
                    indexOfOrderToUpdate = index;
                    return true;
                }
                return false;
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
                orders: updatedOrders
            }
        case SET_ORDERS:
            return {
                ...state,
                orders: action.orders
            }
        case SORT_ORDERS:{
            return {
                orders: [...state.orders].sort((a,b) => a.orderDetails.dateRequested > b.orderDetails.dateRequested ? -1 : 1)
            }
        }
        default:
            return state;
    }
}