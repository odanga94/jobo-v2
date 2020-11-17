import React, { Fragment } from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Linking
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import Card from '../components/UI/Card';

import ENV from '../env';
import Colors from '../constants/colors';
import DefaultStyles from '../constants/default-styles';
import Spinner from './UI/Spinner';

const { width, height } = Dimensions.get('window');

const OrderSummary = props => {
    const { orderDetails, date, totalAmount, problemImage } = props;

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
                    <Text style={styles.title}>status: <Text style={{ fontFamily: 'poppins-bold', color: orderDetails.status === "cancelled" ? "red" : Colors.secondary }}>{formatToSentenceCase(orderDetails.status)}</Text></Text>
                </View>
                {
                    (orderDetails.status === "in progress" || orderDetails.status === "completed") &&
                    <Card style={{ padding: 10, marginVertical: 10 }}>
                        {
                            !orderDetails.proName || !orderDetails.proPhone ?
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                    <Spinner />
                                </View> :
                                <Fragment>
                                    <Text style={{ ...styles.title, textAlign: "center" }}><Text style={{ fontFamily: 'poppins-bold' }}>Pro Details</Text></Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", flex: 2 }}>
                                            <View style={styles.imageContainer}>
                                                <Image source={{ uri: orderDetails.proImage }} style={styles.proImage} />
                                            </View>
                                            <View style={styles.proTextContainer}>
                                                <Text style={[styles.description, { textAlign: 'left', fontWeight: "bold" }]}>{orderDetails.proName}</Text>
                                            </View>
                                        </View>
                                        {
                                            orderDetails.proPhone && orderDetails.status === "in progress" &&
                                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        Linking.openURL(`tel:${orderDetails.proPhone}`)
                                                    }}
                                                    style={styles.button}
                                                >
                                                    <Feather
                                                        name="phone"
                                                        color="white"
                                                        size={30}
                                                    />
                                                    <Text style={{ ...DefaultStyles.titleText, marginHorizontal: 10, color: "white" }}>Call</Text>
                                                </TouchableOpacity>

                                            </View>
                                        }
                                    </View>
                                </Fragment>
                        }
                    </Card>
                }
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
                        orderDetails.serviceNeeded &&
                        <Text style={styles.description}>{orderDetails.problemType === "events" ? "Service(s)" : "Pro"} requested:  {orderDetails.serviceNeeded}</Text>
                    }
                    {
                        orderDetails.proGender &&
                        <Text style={styles.description}>Preferred Gender:  {orderDetails.proGender}</Text>
                    }
                    {
                        orderDetails.equipmentNeeded ?
                            orderDetails.problemType === "moving" ? <Text style={styles.description}>Equipment needed:  {orderDetails.equipmentNeeded}</Text> :
                                <Text style={styles.description}>Equipment/Supplies provided by:  {orderDetails.equipmentNeeded}</Text> : null
                    }
                    <Text style={styles.description}>Additonal Info:  {orderDetails.optionalInfo}</Text>
                    {
                        problemImage ?
                            <View style={styles.problemImageContainer}>
                                <Image source={{ uri: problemImage }} style={styles.problemImage} />
                            </View> :
                            orderDetails.problemImage &&
                            <View style={styles.problemImageContainer}>
                                <Image source={{ uri: orderDetails.problemImage }} style={styles.problemImage} />
                            </View>
                    }
                </View>

                {
                    // orderDetails.status !== "cancelled" && <Text style={{ ...styles.title, marginVertical: 15 }}>Connection Fee: <Text style={{ fontFamily: 'poppins-bold' }}>KES.{totalAmount.toFixed(2)}</Text></Text>
                }
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
    button: {
        backgroundColor: Colors.secondary,
        height: 50,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 30,
        flexDirection: "row"
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
    proImage: {
        width: '100%',
        height: '100%'
    },
    image: {
        width: '100%',
        height: height / 4
    },
    proDetails: {
        flexDirection: 'row',
    },
    proTextContainer: {
        justifyContent: 'center',
        marginLeft: 5
    },
});

export default OrderSummary;