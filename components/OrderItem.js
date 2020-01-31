import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Button,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform,
    Dimensions
} from 'react-native';

import Colors from '../constants/colors';
import MainButton from './UI/MainButton';

const { height } = Dimensions.get('window');

const OrderItem = props => {
    const TouchableCmp = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
    return (
        <TouchableCmp onPress={props.onViewDetail} useForeground>
            <View style={styles.order}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: props.image}} style={styles.image} /*resizeMode='contain'*/ />
                </View>
                <View style={{height: '20%', marginBottom: 10}}>
                    <Text style={styles.date}>{props.date}</Text>
                    <View style={styles.details}>
                        <Text style={styles.title}>{props.problem}</Text>
                        <Text style={styles.price}>KES.{props.price.toFixed(2)}</Text>
                    </View>
                </View>
                <View style={styles.actions} >
                    <MainButton onPress={props.onViewDetail} style={{paddingHorizontal: 12.5, paddingVertical: 5}}>
                        View Details
                    </MainButton>
                </View>
            </View>
        </TouchableCmp>

    )
}

const styles = StyleSheet.create({
    order: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        height: height / 3.5,
        margin: 15,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 16,
        marginVertical: 2,
        fontFamily: 'poppins-bold'
    },
    price: {
        fontSize: 16,
        fontFamily: 'poppins-bold'
    },
    actions: {
        alignItems: 'center',
        height: '30%',
        paddingHorizontal: 20
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    imageContainer: {
        width: height / 7,
        height: height / 7,
        borderRadius: 150,
        borderWidth: 3,
        borderColor: Colors.secondary,
        overflow: "hidden",
        alignSelf: 'center',
        marginVertical: 3
    },
    date: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'poppins-regular',
        color: '#888'
    }
})

export default OrderItem;