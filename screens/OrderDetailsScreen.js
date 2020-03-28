import React from 'react';
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux';

import OrderSummary from '../components/OrderSummary';


const OrderDetailScreen = props => {
    const orderId = props.navigation.getParam('orderId');
    const selectedOrder = useSelector(state => state.orders.orders.find(order => order.id === orderId));

    return (
        <ScrollView>
            <OrderSummary
                orderDetails={selectedOrder.orderDetails}
                date={selectedOrder.readableDate}
                totalAmount={selectedOrder.totalAmount}
            />
        </ScrollView>

    );
}

OrderDetailScreen.navigationOptions = (navData) => {
    //console.log('Nav Data:', navData)
    return {
        headerTitle: navData.navigation.getParam('orderTitle'),
        headerBackTitleVisible: false
    }
}

export default OrderDetailScreen;