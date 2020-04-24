import Order from '../../models/order';
import { 
    ADD_ORDER, 
    SET_ORDERS, 
    UPDATE_ORDER, 
    REMOVE_ORDER,
    SORT_ORDERS,
    SET_ORDER_ID_BEING_PROCESSED,
    RESET_ORDER_ID_BEING_PROCESSED, 
    RESET_ORDERS
} from '../actions/orders';

const initialState = {
    orders: [],
    orderIdBeingProcessed: null
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
                ...state,
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
                ...state,
                orders: updatedOrders
            }
        case REMOVE_ORDER:
            return {
                ...state,
                orders: state.orders.filter(order => order.id !== action.orderId)
            }
        case SET_ORDERS:
            return {
                ...state,
                orders: action.orders
            }
        case SORT_ORDERS:{
            return {
                ...state,
                orders: [...state.orders].sort((a,b) => a.orderDetails.dateRequested > b.orderDetails.dateRequested ? -1 : 1)
            }
        }
        case SET_ORDER_ID_BEING_PROCESSED:
            return {
                ...state,
                orderIdBeingProcessed: action.orderId
            }
        case RESET_ORDER_ID_BEING_PROCESSED:
            return {
                ...state,
                orderIdBeingProcessed: null
            }
        case RESET_ORDERS:
            return initialState
        default:
            return state;
    }
}