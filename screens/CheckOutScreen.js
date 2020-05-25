import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import * as firebase from 'firebase';

import Modal from '../components/UI/Modal';
import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';
import OrderSummary from '../components/OrderSummary';
import DefaultStyles from '../constants/default-styles';
import Colors from '../constants/colors';

import * as orderActions from '../store/actions/orders';
import * as profileActions from '../store/actions/user/profile';
import * as currentJobActions from '../store/actions/currentJob';

const { width } = Dimensions.get('window');

const CheckOutScreen = props => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);
    const orderIdBeingProcessed = useSelector(state => state.orders.orderIdBeingProcessed);
    const userName = useSelector(state => state.profile.name);
    const { connectionFee } = useSelector(state => state.settings);

    const { navigation } = props;
    const orderDetails = navigation.getParam('orderDetails');
    const problemImage = navigation.getParam('problemImage');
    const clientPhone = navigation.getParam('clientPhone');

    const [addOrderLoading, setAddOrderLoading] = useState(false);
    const [addOrderError, setAddOrderError] = useState();
    const [transactionSuccess, setTransactionSuccess] = useState(false);
    const [transactionError, setTransactionError] = useState(false);
    const [paymentType, setPaymentType] = useState("mpesa");

    useEffect(() => {
        const paymentRef = firebase.database().ref(`payments/${userId}/${orderIdBeingProcessed}`);
        const handleChildAdded = (dataSnapshot) => {
            const dataWritten = dataSnapshot.val();
            //console.log('data', dataWritten);
            if (dataWritten.Body.stkCallback.ResultCode === 0) {
                dispatch({
                    type: currentJobActions.SET_CURRENT_JOB,
                    currentJobOrderId: orderIdBeingProcessed
                });
                dispatch({
                    type: orderActions.RESET_ORDER_ID_BEING_PROCESSED
                });
                setTransactionSuccess(true);
            } else {
                setTransactionError(true);
                dispatch({
                    type: orderActions.UPDATE_ORDER,
                    orderId: orderIdBeingProcessed,
                    valueToUpdate: "status",
                    value: "cancelled"
                });
                dispatch({
                    type: orderActions.RESET_ORDER_ID_BEING_PROCESSED
                });
            }
            setAddOrderLoading(false);

        }

        if (userId && orderIdBeingProcessed) {
            if (paymentType === "mpesa") {
                paymentRef.on("child_added", handleChildAdded);
            } else {
                processCardOrder();
            }
        }

        return () => paymentRef.off("child_added", handleChildAdded);
    }, [userId, orderIdBeingProcessed]);

    useEffect(() => {
        let goToMap;
        if (transactionSuccess) {
            goToMap = setTimeout(() => {
                navigateToMap();
            }, 10000);
        }

        return () => clearTimeout(goToMap);
    }, [transactionSuccess])

    const addOrder = async (type) => {
        setAddOrderError(null);
        setAddOrderLoading(true);
        setPaymentType(type);
        try {
            if (!navigation.getParam('initiallyHadPhoneNo')) {
                dispatch(profileActions.editProfile(
                    userId,
                    {
                        name: userName,
                        phone: clientPhone
                    }
                ));
            }
            await dispatch(orderActions.addOrder(userId, orderDetails, problemImage, type, clientPhone));
            dispatch({
                type: orderActions.SORT_ORDERS
            });
        } catch (err) {
            setAddOrderError(err.message);
            setAddOrderLoading(false);
        }
    }

    const processCardOrder = async () => {
        try {
            await firebase.database().ref(`pending_jobs/${userId}`)
                .set({ currentJobOrderId: orderIdBeingProcessed });
            dispatch({
                type: currentJobActions.SET_CURRENT_JOB,
                currentJobOrderId: orderIdBeingProcessed
            });
            dispatch({
                type: orderActions.RESET_ORDER_ID_BEING_PROCESSED
            });
            setTransactionSuccess(true);
        } catch (err) {
            setTransactionError(true);
        }
        setAddOrderLoading(false);
    }

    const getreadableDate = (date) => {
        return moment(date).format('MMMM Do YYYY, h:mm a')
    }

    const navigateToMap = () => {
        setTransactionSuccess(false);
        navigation.navigate('Map', { fromCheckout: true });
    }

    if (addOrderLoading) {
        return (
            <View style={styles.container}>
                <Spinner />
            </View>
        );
    }

    if (addOrderError) {
        return (
            <View style={styles.container}>
                <Text style={DefaultStyles.bodyText}>{addOrderError}</Text>
                {/* <Image source={require('../assets/success-tick.png')} style={{ width: 150, height: 150, marginVertical: 10 }} /> */}
            </View>
        );
    }

    if (transactionSuccess) {
        return (
            <Modal visible={transactionSuccess} pressed={navigateToMap}>
                <View style={styles.successContainer}>
                    <Text style={{ ...DefaultStyles.titleText, textAlign: "center" }}>Payment of KES. 200 Successful!</Text>
                    <Image source={require('../assets/success-tick.png')} style={{ width: 150, height: 150, marginVertical: 15 }} />
                    <MainButton
                        style={{ marginTop: 20 }}
                        onPress={() => {
                            navigateToMap();
                        }}
                    >Okay</MainButton>
                </View>
            </Modal>
        );
    }

    if (transactionError) {
        return (
            <Modal visible={transactionError} pressed={() => { setTransactionError(false) }}>
                <View style={styles.successContainer}>
                    <Text style={{ ...DefaultStyles.titleText, textAlign: "center" }}>Payment was unsuccessful. Your order has been cancelled 😔</Text>
                    <Image source={require('../assets/error.png')} style={{ width: 150, height: 150, marginVertical: 15 }} />
                    <MainButton
                        style={{ marginTop: 20 }}
                        onPress={() => {
                            setTransactionError(false);
                        }}
                    >Okay</MainButton>
                </View>
            </Modal>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: "white" }}>
            <OrderSummary
                problemImage={problemImage}
                orderDetails={orderDetails}
                date={getreadableDate(orderDetails.dateRequested)}
                totalAmount={connectionFee}
            />
            <View style={{ margin: 20 }}>
                <View style={styles.paymentTextContainer}>
                    <Text style={{ ...DefaultStyles.titleText, color: "#505050" }}>Pay with:</Text>
                </View>
                <View style={styles.paymentContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            addOrder("mpesa");
                        }}
                        style={styles.button}
                    >
                        <Image
                            style={styles.image}
                            source={require('../assets/mpesa.png')}
                            resizeMode="contain"
                        />
                        <Text style={{ ...DefaultStyles.bodyText, marginLeft: 10, fontSize: 16 }}>M-Pesa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            addOrder("card");
                        }}
                    >
                        <FontAwesome
                            name="credit-card-alt"
                            size={23}
                            color={Colors.secondary}
                        />
                        <Text style={{ ...DefaultStyles.bodyText, marginLeft: 10, fontSize: 16 }}>Card</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginHorizontal: 20, alignItems: "center", marginTop: 20 }}>
                <MainButton
                    onPress={() => {
                        navigation.navigate('Map');
                    }}
                    style={{ backgroundColor: '#dd0000', height: 50 }}
                >
                    Cancel Order
            </MainButton>
            </View>


        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white"
    },
    successContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "white",
        width: "85%"
    },
    paymentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        width: width / 2.5,
        height: 50,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1,
        flexDirection: "row"
    },
    image: {
        width: 30,
        height: 23
    },
    paymentTextContainer: {
        borderBottomColor: "#505050",
        borderBottomWidth: 1,
        width: width / 2.5,
        marginBottom: 10
    }
});

export default CheckOutScreen;