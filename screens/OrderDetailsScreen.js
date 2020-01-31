import React from 'react';
import {
    ScrollView,
    Button,
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native';
import { useSelector } from 'react-redux';

import Card from '../components/UI/Card';
import Colors from '../constants/colors';

const { height } = Dimensions.get('window');

const OrderDetailScreen = props => {
    const orderId = props.navigation.getParam('orderId');
    const selectedOrder = useSelector(state => state.orders.orders.find(order => order.id === orderId));

    return (
        <ScrollView>
            <Image source={{uri: selectedOrder.mapImage}} style={styles.image} />
            <Text style={styles.description}>{selectedOrder.clientAddress}</Text>
            <View style={styles.datePriceContainer}>
                <Text style={styles.datePrice}>{selectedOrder.readableDate}</Text>
                <Text style={styles.datePrice}>KES.{selectedOrder.totalAmount.toFixed(2)}</Text>
            </View>
            <Card style={{ marginHorizontal: 20, padding: 10 }}>
                <Text style={styles.title}>You requested for a {selectedOrder.service}</Text>
                <View style={styles.proDetails}>
                    <View style={styles.imageContainer}>
                        <Image source={{uri: selectedOrder.proImage}} style={styles.proImage} />
                    </View>
                    <View style={styles.proTextContainer}>
                        <Text style={[styles.description, {textAlign: 'left'}]}>Name:  {selectedOrder.proName}</Text>
                        <Text style={[styles.description, {textAlign: 'left'}]}>Problem:  {selectedOrder.problemName}</Text>
                    </View>
                </View>
            </Card>
        </ScrollView>
    )
}

OrderDetailScreen.navigationOptions = (navData) => {
    //console.log('Nav Data:', navData)
    return {
        headerTitle: navData.navigation.getParam('orderTitle')
    }
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: height / 3
    },
    datePriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20
    },
    datePrice: {
        fontSize: 16,
        color: '#888',
        //textAlign: 'center',
        fontFamily: 'poppins-bold',

    },
    title: {
        fontSize: 16,
        fontFamily: 'poppins-bold',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20,
        fontFamily: 'poppins-regular'
    },
    imageContainer: {
        width: height / 7,
        height: height / 7,
        borderRadius: 150,
        borderWidth: 3,
        borderColor: Colors.secondary,
        overflow: "hidden",
        marginVertical: 3
    },
    proDetails: {
        flexDirection: 'row',
    },
    proTextContainer: {
        justifyContent: 'center'
    },
    proImage: {
        width: '100%',
        height: '100%',
    },
});

export default OrderDetailScreen;