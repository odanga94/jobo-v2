import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import * as firebase from 'firebase';

import OrderSummary from '../components/OrderSummary';
import { UPDATE_ORDER } from '../store/actions/orders';
import { DELETE_CURRENT_JOB } from '../store/actions/currentJob';


const OrderDetailScreen = props => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);
    const orderId = props.navigation.getParam('orderId');
    const selectedOrder = useSelector(state => state.orders.orders.find(order => order.id === orderId));

    //const [order, setOrder] = useState(selectedOrder);

    useEffect(() => {
        const currentJobRef = firebase.database().ref(`orders/${userId}/${orderId}`);
        const onChildChanged = (dataSnapShot) => {
            if(dataSnapShot.key === "status"){
                /*setCurrentJobDetails(currState => {
                    return {
                        ...currState,
                        status: dataSnapShot.val()
                    }
                });*/
                dispatch({
                    type: UPDATE_ORDER,
                    orderId: orderId,
                    valueToUpdate: "status",
                    value: dataSnapShot.val()
                });
                if(dataSnapShot.val() === "completed"){
                    dispatch({
                        type: DELETE_CURRENT_JOB
                    });
                } 
            };
        }
        if (orderId){
            currentJobRef.on("child_changed", onChildChanged);
        }

        return () => {
            currentJobRef.off("child_changed", onChildChanged);
        }
        
    }, [orderId]);

    return (
        <ScrollView>
            <OrderSummary
                orderDetails={selectedOrder.orderDetails}
                date={selectedOrder.readableDate}
                totalAmount={selectedOrder.totalAmount}
                proImage={selectedOrder.proImage}
                proName={selectedOrder.proName}
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