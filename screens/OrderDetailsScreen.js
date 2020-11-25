import React, { useEffect, useState } from 'react';
import { ScrollView, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import * as firebase from 'firebase';

import OrderSummary from '../components/OrderSummary';
import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';

import { UPDATE_ORDER } from '../store/actions/orders';
import { DELETE_CURRENT_JOB } from '../store/actions/currentJob';
import * as orderActions from '../store/actions/orders';

const OrderDetailScreen = props => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);
    const orderId = props.navigation.getParam('orderId');
    const selectedOrder = useSelector(state => state.orders.orders.find(order => order.id === orderId));

    const [cancelJobLoading, setCancelJobLoading] = useState(false);

    useEffect(() => {
        const currentJobRef = firebase.database().ref(`orders/${userId}/${orderId}`);
        const onChildChanged = async (dataSnapShot) => {
            console.log(dataSnapShot.key);
            if (dataSnapShot.key === "status") {
                dispatch({
                    type: UPDATE_ORDER,
                    orderId: orderId,
                    valueToUpdate: "status",
                    value: dataSnapShot.val()
                });
                if (dataSnapShot.val() === "in progress" || "completed") {
                    const assignedProIdSnapshot = await firebase.database().ref(`orders/${userId}/${orderId}/assignedProId`).once("value");
                    const assignedProId = assignedProIdSnapshot.val();
                    dispatch({
                        type: UPDATE_ORDER,
                        orderId: currentJobOrderId,
                        valueToUpdate: "assignedProId",
                        value: assignedProId
                    });
                }
                if (dataSnapShot.val() === "completed" || dataSnapShot.val() === "cancelled") {
                    dispatch({
                        type: DELETE_CURRENT_JOB
                    });
                }
            } else if (dataSnapShot.key === "assignedProId") {
                if ((selectedOrder.orderDetails.status === "in progress" || selectedOrder.orderDetails.status === "completed") && !selectedOrder.orderDetails.proName && selectedOrder.orderDetails.assignedProId) {
                    fetchProDetails(selectedOrder.orderDetails.problemType, selectedOrder.orderDetails.assignedProId);
                }
            }
        }
        if (orderId) {
            currentJobRef.on("child_changed", onChildChanged);
        }

        return () => {
            currentJobRef.off("child_changed", onChildChanged);
        }

    }, [orderId]);

    useEffect(() => {
        if ((selectedOrder.orderDetails.status === "in progress" || selectedOrder.orderDetails.status === "completed") && !selectedOrder.orderDetails.proName && selectedOrder.orderDetails.assignedProId) {
            fetchProDetails(selectedOrder.orderDetails.problemType, selectedOrder.orderDetails.assignedProId);
        }
    }, [selectedOrder])

    const fetchProDetails = async (problemType, proId, orderId) => {
        await dispatch(orderActions.fetchProDetails(problemType, proId, orderId));
    }

    const cancelJobHandler = async () => {
        setCancelJobLoading(true);
        try {
            await firebase.database().ref(`orders/${userId}/${orderId}`).update({ status: "cancelled" });
            await firebase.database().ref(`pending_jobs/${userId}`).remove();
        } catch (err) {
            Alert.alert('An error occurred!', err.message, [{ text: 'Okay' }]);
        }
        setCancelJobLoading(false);
    }

    return (
        <ScrollView>
            <OrderSummary
                orderDetails={selectedOrder.orderDetails}
                date={selectedOrder.readableDate}
                totalAmount={selectedOrder.totalAmount}
            />
            {
                cancelJobLoading ?
                <Spinner /> :
                selectedOrder.orderDetails.status === "pending" &&
                <MainButton
                    style={{ backgroundColor: '#ff726f', marginHorizontal: 20, marginVertical: 10 }}
                    onPress={() => {
                        Alert.alert('Are you sure?', 'Do you really want to cancel this job? This action is irreversible.', [
                            { text: 'No', style: 'default' },
                            {
                                text: 'Yes', style: 'destructive', onPress: () => {
                                    cancelJobHandler();
                                }
                            }
                        ])
                    }}
                >Cancel Job</MainButton>
            }
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