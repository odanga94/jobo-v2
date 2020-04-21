import React, { useEffect, useState, useCallback, Fragment } from 'react';
import { FlatList, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import OrderItem from '../components/OrderItem';
import * as orderActions from '../store/actions/orders';
import Spinner from '../components/UI/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import MainButton from '../components/UI/MainButton';
import DefaultStyles from '../constants/default-styles'

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const userId = useSelector(state => state.auth.userId)
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    const loadOrders = async () => {
        setError(null);
        //console.log(orders.length)
        if(orders.length === 0){
            setIsLoading(true);
        }
        try {
            await dispatch(orderActions.fetchOrders(userId));
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
        setIsLoading(false);
    }


    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        if(orders.length > 0){
            setIsLoading(false);
        }
    }, [orders])


    if (isLoading) {
        return (
            <View style={{flex: 1, justifyContent: "center"}}>
                <Spinner />
            </View>
        ); 
    }

    if (error) {
        return <ErrorMessage retry={loadOrders} error={error} />
    }

    if (orders.length === 0){
        return (
            <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20}}>
                <Text style={DefaultStyles.titleText}>You haven't placed any orders yet. Get 25% discount on your first order today.</Text>
                <MainButton
                    style={{marginTop: 10}}
                    onPress={() => { props.navigation.navigate('Services') }}
                >View Services</MainButton>
            </View>
        );  
    }
    //console.log(orders);

    return (
        <FlatList
            onRefresh={loadOrders}
            refreshing={isLoading}
            data={orders}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <OrderItem
                    orderId={itemData.item.id}
                    orderDetails={itemData.item.orderDetails}
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