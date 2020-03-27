import React, { useEffect, useState } from 'react';
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
import ENV from '../env';

const { width, height } = Dimensions.get('window');

const OrderDetailScreen = props => {
    const orderId = props.navigation.getParam('orderId');
    const selectedOrder = useSelector(state => state.orders.orders.find(order => order.id === orderId));

    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    const formatToSentenceCase = text => text.split("")[0].toUpperCase() + text.slice(1);

    useEffect(() => {
        if (selectedOrder.orderDetails.clientLocation) {
            const location = selectedOrder.orderDetails.clientLocation
            setImagePreviewUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=16&size=600x300&maptype=roadmap&markers=color:red%7Clabel:%7C${location.lat},${location.lng}&key=${ENV.googleApiKey}`);
        }
    }, [selectedOrder]);

    return (
        <ScrollView>
            <Image source={{ uri: imagePreviewUrl }} style={styles.image} />
            <Text style={{ ...styles.description, textAlign: "center", marginTop: 5 }}>{selectedOrder.orderDetails.clientAddress}</Text>
            <View style={styles.infoContainer}>
                <View style={{ marginVertical: 10 }}>
                    <View style={styles.datePriceContainer}>
                        <Text style={styles.datePrice}>{selectedOrder.readableDate}</Text>
                    </View>
                    <Text style={styles.title}>status: <Text style={{ fontFamily: 'poppins-bold', color: Colors.secondary }}>{formatToSentenceCase(selectedOrder.orderDetails.status)}</Text></Text>
                </View>

                {/* <View style={styles.proDetails}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: selectedOrder.proImage }} style={styles.proImage} />
                    </View>
                    <View style={styles.proTextContainer}>
                        <Text style={[styles.description, { textAlign: 'left' }]}>Name:  {selectedOrder.proName}</Text>
                        <Text style={[styles.description, { textAlign: 'left' }]}>Problem:  {selectedOrder.problemName}</Text>
                    </View>
                </View> */}

                <View style={{ marginVertical: 10 }}>
                    <Text style={styles.title}>You requested for <Text style={{ fontFamily: 'poppins-bold' }}>{formatToSentenceCase(selectedOrder.orderDetails.problemType)}</Text> service.</Text>
                    {
                        selectedOrder.orderDetails.problemNames &&
                        <Text style={styles.description}>Description:  {selectedOrder.orderDetails.problemNames}</Text>
                    }
                    {
                        selectedOrder.orderDetails.partsThatNeedWork &&
                        <Text style={styles.description}>Fixtures that needed work:  {selectedOrder.orderDetails.partsThatNeedWork}</Text>
                    }
                    {
                        selectedOrder.orderDetails.buildingType &&
                        <Text style={styles.description}>Building Type:  {selectedOrder.orderDetails.buildingType}</Text>
                    }
                    {
                        selectedOrder.orderDetails.roomsThatNeedWork &&
                        <Text style={styles.description}>Applicable rooms:  {selectedOrder.orderDetails.roomsThatNeedWork}</Text>
                    }
                    {
                        selectedOrder.orderDetails.bucketsOfClothes &&
                        <Text style={styles.description}>Buckets Of Clothes:  {selectedOrder.orderDetails.bucketsOfClothes}</Text>
                    }
                    {
                        selectedOrder.orderDetails.mealDescription &&
                        <Text style={styles.description}>Meal Description:  {selectedOrder.orderDetails.mealDescription}</Text>
                    }
                    {
                        selectedOrder.orderDetails.numberOfPeople &&
                        <Text style={styles.description}>Number Of People:  {selectedOrder.orderDetails.numberOfPeople}</Text>
                    }
                    {
                        selectedOrder.orderDetails.equipmentNeeded ?
                        selectedOrder.orderDetails.problemType === "moving" ? <Text style={styles.description}>Equipment needed:  {selectedOrder.orderDetails.equipmentNeeded}</Text> :
                        <Text style={styles.description}>Equipment/Supplies provided by:  {selectedOrder.orderDetails.equipmentNeeded}</Text> : null
                    }
                    <Text style={styles.description}>Additonal Info:  {selectedOrder.orderDetails.optionalInfo}</Text>
                    {
                        selectedOrder.orderDetails.problemImage &&
                        <View style={styles.problemImageContainer}>
                            <Image source={{ uri: selectedOrder.orderDetails.problemImage }} style={styles.problemImage} />
                        </View>
                    }
                </View>
                <Text style={{ ...styles.title, marginVertical: 15 }}>Connection Fee: <Text style={{ fontFamily: 'poppins-bold' }}>KES.{selectedOrder.totalAmount.toFixed(2)}</Text></Text>

            </View>
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
    problemImageContainer: {
        width: width / 3,
        height: width / 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        marginTop: 5
    },
    problemImage: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    infoContainer: {
        marginHorizontal: 20,
    },
    datePriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    datePrice: {
        fontSize: 16,
        color: '#888',
        //textAlign: 'center',
        fontFamily: 'poppins-bold',

    },
    title: {
        fontSize: 16,
        fontFamily: 'poppins-regular',
    },
    description: {
        fontSize: 14,
        fontFamily: 'poppins-regular'
    },
    imageContainer: {
        width: height / 8,
        height: height / 8,
        borderRadius: 150,
        borderWidth: 3,
        borderColor: Colors.secondary,
        overflow: "hidden",
        marginVertical: 3
    },
    image: {
        width: '100%',
        height: height / 4
    },
    proDetails: {
        flexDirection: 'row',
    },
    proTextContainer: {
        justifyContent: 'center'
    },
});

export default OrderDetailScreen;