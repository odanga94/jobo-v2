import React, { useState } from 'react';
import moment from 'moment';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';

import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';
import OrderSummary from '../components/OrderSummary';
import DefaultStyles from '../constants/default-styles';
import Colors from '../constants/colors';

import * as orderActions from '../store/actions/orders';

const { width } = Dimensions.get('window');

const CheckOutScreen = props => {

    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);

    const { navigation } = props;
    const orderDetails = navigation.getParam('orderDetails');
    const problemImage = navigation.getParam('problemImage');


    const [addOrderLoading, setAddOrderLoading] = useState(false);
    const [addOrderError, setAddOrderError] = useState();

    const addOrder = async () => {
        setAddOrderError(null);
        setAddOrderLoading(true);
        try {
            await dispatch(orderActions.addOrder(userId, orderDetails, problemImage));
            dispatch({
                type: orderActions.SORT_ORDERS
            });
            setAddOrderLoading(false);
            navigation.navigate('Map');
        } catch (err) {
            setAddOrderError(err.message);
            setAddOrderLoading(false);
        }
    }

    const getreadableDate = (date) => {
        return moment(date).format('MMMM Do YYYY, h:mm a')
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
            </View>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: "white" }}>
            <OrderSummary
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
                            addOrder();
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
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
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