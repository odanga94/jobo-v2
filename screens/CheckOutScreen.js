import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import * as firebase from 'firebase';

import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';
import OrderSummary from '../components/OrderSummary';
import DefaultStyles from '../constants/default-styles';
import Colors from '../constants/colors';

import * as orderActions from '../store/actions/orders';
import * as currentJobActions from '../store/actions/currentJob';

const { width } = Dimensions.get('window');

const CheckOutScreen = props => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);
    const orders = useSelector(state => state.orders.orders);

    const { navigation } = props;
    const orderDetails = navigation.getParam('orderDetails');
    const problemImage = navigation.getParam('problemImage');


    const [addOrderLoading, setAddOrderLoading] = useState(false);
    const [addOrderError, setAddOrderError] = useState();
    const [transactionSuccess, setTransactionSuccess] = useState(false);

    useEffect(() => {
        const paymentRef = firebase.database().ref(`payments/${userId}`);
        const handleChildAdded = async (dataSnapshot) => {
            //console.log('orderId', dataSnapshot.key);
            if (dataSnapshot.key === orders[0].id) {
                dispatch({
                    type: currentJobActions.SET_CURRENT_JOB,
                    currentJobOrderId: dataSnapshot.key
                });
                setAddOrderLoading(false);
                setTransactionSuccess(true);
            }
        }
        if (userId && orders.length > 0) {
            paymentRef.on("child_added", handleChildAdded);
        }
        return () => paymentRef.off("child_added", handleChildAdded);
    }, [userId, orders]);

    useEffect(() => {
        let goToMap;
        if (transactionSuccess) {
            goToMap = setTimeout(() => {
                navigateToMap();
            }, 10000);
        }

        return () => clearTimeout(goToMap);
    }, [transactionSuccess])

    const addOrder = async (paymentType) => {
        setAddOrderError(null);
        setAddOrderLoading(true);
        try {
            await dispatch(orderActions.addOrder(userId, orderDetails, problemImage, paymentType));
            dispatch({
                type: orderActions.SORT_ORDERS
            });
        } catch (err) {
            setAddOrderError(err.message);
            setAddOrderLoading(false);
        }
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={transactionSuccess}
                onRequestClose={() => {
                    console.log('Modal has been closed.');
                }}
            >
                <TouchableWithoutFeedback onPress={navigateToMap} >
                    <View style={styles.bigContainer}>
                        <TouchableWithoutFeedback>
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
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: "white" }}>
            <OrderSummary
                problemImage={problemImage}
                orderDetails={orderDetails}
                date={getreadableDate(orderDetails.dateRequested)}
                totalAmount={200}
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
                            addOrder();
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
    bigContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        alignItems: "center",
        justifyContent: "center"
    },
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
        backgroundColor: "white"
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