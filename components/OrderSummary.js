import React, { Fragment } from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions
} from 'react-native'

import ENV from '../env';
import Colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

const OrderSummary = props => {
    const { orderDetails, date, totalAmount } = props;
    const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${orderDetails.clientLocation.lat},${orderDetails.clientLocation.lng}&zoom=16&size=600x300&maptype=roadmap&markers=color:red%7Clabel:%7C${orderDetails.clientLocation.lat},${orderDetails.clientLocation.lng}&key=${ENV.googleApiKey}`;

    const formatToSentenceCase = text => text.split("")[0].toUpperCase() + text.slice(1);

    return (
        <Fragment>
            <Image source={{ uri: imagePreviewUrl }} style={styles.image} />
            <Text style={{ ...styles.description, textAlign: "center", marginTop: 5 }}>{orderDetails.clientAddress}</Text>
            <View style={styles.infoContainer}>
                <View style={{ marginVertical: 10 }}>
                    <View style={styles.datePriceContainer}>
                        <Text style={styles.datePrice}>{date}</Text>
                    </View>
                    <Text style={styles.title}>status: <Text style={{ fontFamily: 'poppins-bold', color: Colors.secondary }}>{formatToSentenceCase(orderDetails.status)}</Text></Text>
                </View>

                {/* <View style={styles.proDetails}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: proImage }} style={styles.proImage} />
                    </View>
                    <View style={styles.proTextContainer}>
                        <Text style={[styles.description, { textAlign: 'left' }]}>Name:  {proName}</Text>
                        <Text style={[styles.description, { textAlign: 'left' }]}>Problem:  {problemName}</Text>
                    </View>
                </View> */}

                <View style={{ marginVertical: 10 }}>
                    <Text style={styles.title}>You requested for <Text style={{ fontFamily: 'poppins-bold' }}>{formatToSentenceCase(orderDetails.problemType)}</Text> service.</Text>
                    {
                        orderDetails.problemNames &&
                        <Text style={styles.description}>Description:  {orderDetails.problemNames}</Text>
                    }
                    {
                        orderDetails.partsThatNeedWork &&
                        <Text style={styles.description}>Fixtures that needed work:  {orderDetails.partsThatNeedWork}</Text>
                    }
                    {
                        orderDetails.buildingType &&
                        <Text style={styles.description}>Building Type:  {orderDetails.buildingType}</Text>
                    }
                    {
                        orderDetails.roomsThatNeedWork &&
                        <Text style={styles.description}>Applicable rooms:  {orderDetails.roomsThatNeedWork}</Text>
                    }
                    {
                        orderDetails.bucketsOfClothes &&
                        <Text style={styles.description}>Buckets Of Clothes:  {orderDetails.bucketsOfClothes}</Text>
                    }
                    {
                        orderDetails.mealDescription &&
                        <Text style={styles.description}>Meal Description:  {orderDetails.mealDescription}</Text>
                    }
                    {
                        orderDetails.numberOfPeople &&
                        <Text style={styles.description}>Number Of People:  {orderDetails.numberOfPeople}</Text>
                    }
                    {
                        orderDetails.equipmentNeeded ?
                        orderDetails.problemType === "moving" ? <Text style={styles.description}>Equipment needed:  {orderDetails.equipmentNeeded}</Text> :
                        <Text style={styles.description}>Equipment/Supplies provided by:  {orderDetails.equipmentNeeded}</Text> : null
                    }
                    <Text style={styles.description}>Additonal Info:  {orderDetails.optionalInfo}</Text>
                    {
                        orderDetails.problemImage &&
                        <View style={styles.problemImageContainer}>
                            <Image source={{ uri: orderDetails.problemImage }} style={styles.problemImage} />
                        </View>
                    }
                </View>
                <Text style={{ ...styles.title, marginVertical: 15 }}>Connection Fee: <Text style={{ fontFamily: 'poppins-bold' }}>KES.{totalAmount.toFixed(2)}</Text></Text>

            </View>
        </Fragment>
    );
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

export default OrderSummary;