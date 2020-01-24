import React from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import OrderItem from '../components/OrderItem';

const OrdersScreen = props => {
    const orders = useSelector(state => state.orders.orders);
    return (
        <FlatList
            data={orders}
            renderItem={itemData => (
                <OrderItem
                    image={itemData.item.proImage}
                    problem={itemData.item.problemName}
                    price={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                />
            )}
            keyExtractor={item => item.id}
        />
    )

}


export default OrdersScreen