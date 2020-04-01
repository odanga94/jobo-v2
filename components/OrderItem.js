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
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import MainButton from './UI/MainButton';
import DefaultStyles from '../constants/default-styles'

const { height } = Dimensions.get('window');

const OrderItem = props => {
    const formatToSentenceCase = text => text.split("")[0].toUpperCase() + text.slice(1);

    const TouchableCmp = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
    return (
        <TouchableCmp onPress={props.onViewDetail} useForeground>
            <View style={styles.order}>
                <View style={styles.proInfoContainer}>
                    <View style={styles.imageContainer}>
                        {
                            props.status === "pending" ? 
                            <Ionicons
                                color="#505050"
                                name="ios-person"
                                size={70}
                            /> :
                            <Image source={{ uri: props.image }} style={styles.image} /*resizeMode='contain'*/ />
                        }    
                    </View>
                    <View>
                        {
                            props.status === "pending" ?
                            <Text style={{ ...styles.title, color: "#505050" }}><Text style={styles.date}>Pro unassigned: </Text></Text> :
                            <Text style={{ ...styles.title, color: "#505050" }}><Text style={styles.date}>Pro Name: </Text>{props.proName}</Text>
                        }
                        
                        <Text style={styles.date}>{props.date}</Text>
                    </View>
                </View>
                <View style={{ /*height: '20%',*/ marginBottom: 10 }}>
                    <View style={styles.details}>
                        <Text style={styles.title}>{formatToSentenceCase(props.problem)}</Text>
                        <Text style={styles.price}>KES.{props.price.toFixed(2)}</Text>
                    </View>
                    <Text style={DefaultStyles.bodyText}>status:  <Text style={{color: Colors.secondary}}>{formatToSentenceCase(props.status)}</Text></Text>
                </View>
                <View style={styles.actions} >
                    <MainButton onPress={props.onViewDetail} style={{ paddingHorizontal: 12.5, paddingVertical: 5 }}>
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
        paddingHorizontal: 10,
        justifyContent: "space-around"
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
    
    },
    imageContainer: {
        width: height / 8,
        height: height / 8,
        borderRadius: 150,
        borderWidth: 3,
        borderColor: Colors.secondary,
        overflow: "hidden",
        marginVertical: 3,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    proInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 3
    },
    date: {
        fontSize: 16,
        fontFamily: 'poppins-regular',
        color: '#888'
    }
})

export default OrderItem;