import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import OrderItem from '../components/OrderItem';
import * as orderActions from '../store/actions/orders';

const OrdersScreen = props => {
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        /*dispatch(orderActions.addOrder(
            'Broken Sink',
            'Plumber',
            1000,
            'John Odanga',
            'https://firebasestorage.googleapis.com/v0/b/jobo-3a84b.appspot.com/o/proPic.jpg?alt=media&token=63fe6e15-9529-432b-b6e5-74d792b5211d',
            'Ngong View Flats, Thiong\'o Road',
            'https://firebasestorage.googleapis.com/v0/b/jobo-3a84b.appspot.com/o/mapPic.jpg?alt=media&token=9ee9f8da-d587-4b73-9d8d-4c24d8f36009'
        ));
        dispatch(orderActions.addOrder(
            'Laundry',
            'Cleaner',
             300,
             'Olivia',
            'https://firebasestorage.googleapis.com/v0/b/jobo-3a84b.appspot.com/o/proPic.jpg?alt=media&token=63fe6e15-9529-432b-b6e5-74d792b5211d',
            'BuruBuru Phase V',
            'https://firebasestorage.googleapis.com/v0/b/jobo-3a84b.appspot.com/o/mapPic.jpg?alt=media&token=9ee9f8da-d587-4b73-9d8d-4c24d8f36009'
        ));*/
        dispatch(orderActions.fetchOrders());
    }, [dispatch]);

    return (
        <FlatList
            data={orders}
            renderItem={itemData => (
                <OrderItem
                    image={itemData.item.proImage}
                    problem={itemData.item.problemName}
                    price={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    onViewDetail={() => {
                        const dateTimeStamp = new Date(itemData.item.id).getTime();
                        props.navigation.navigate({
                            routeName: 'OrderDetails',
                            params: {
                                orderId: itemData.item.id,
                                orderTitle: `Order  ${itemData.item.id}`
                            }
                        })
                    }}
                />
            )}
        />
    )

}


export default OrdersScreen