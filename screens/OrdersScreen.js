import React, { useEffect, useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import OrderItem from '../components/OrderItem';
import * as orderActions from '../store/actions/orders';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/ErrorMessage';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const userId = useSelector(state => state.auth.userId)
    const orders = useSelector(state => state.orders.orders);
    const userLocation = useSelector(state => state.location.userLocation);
    const dispatch = useDispatch();

    const loadOrders = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(orderActions.fetchOrders(userId));
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError, userId]);

    /*useEffect(() => {
        /*dispatch(orderActions.addOrder(
            userId,
            'Broken Sink',
            'Plumber',
            1000,
            'John Odanga',
            'https://firebasestorage.googleapis.com/v0/b/jobo-3a84b.appspot.com/o/proPic.jpg?alt=media&token=63fe6e15-9529-432b-b6e5-74d792b5211d',
            userLocation
        ));
        dispatch(orderActions.addOrder(
            userId,
            'Laundry',
            'Cleaner',
             300,
             'Olivia',
            'https://firebasestorage.googleapis.com/v0/b/jobo-3a84b.appspot.com/o/proPic.jpg?alt=media&token=63fe6e15-9529-432b-b6e5-74d792b5211d',
            userLocation,
        ));
    }, [userId, userLocation, dispatch]);*/

    useEffect(() => {
        loadOrders();
    }, [dispatch, loadOrders]);

    useEffect(() => {
        const WillFocusSub = props.navigation.addListener('willFocus', () => {
            loadOrders();
        });
        return () => {
            WillFocusSub.remove();
        }
    }, [loadOrders]);

    if (isLoading) {
        return <Spinner />
    }

    if (error) {
        return <ErrorMessage retry={loadOrders} error={error} />
    }
    //console.log(userLocation);

    return (
        <FlatList
            onRefresh={loadOrders}
            refreshing={isLoading}
            data={orders}
            renderItem={itemData => (
                <OrderItem
                    image={itemData.item.proImage}
                    problem={itemData.item.problemName}
                    price={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    onViewDetail={() => {
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