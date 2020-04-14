import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Text, StyleSheet, Alert, Image, View, TouchableOpacity, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import * as firebase from 'firebase';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';

import Card from '../components/UI/Card';
import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';
import defaultStyles from '../constants/default-styles';
import * as locationActions from '../store/actions/location';
import * as currentJobActions from '../store/actions/currentJob';
import * as orderActions from '../store/actions/orders';
import { ADD_ORDER, UPDATE_ORDER, fetchOrders } from '../store/actions/orders';
import { HAS_ORDERS } from '../store/actions/user/profile';
import Colors from '../constants/colors';

const convertToSentenceCase = str => str.charAt(0).toUpperCase() + str.slice(1);
const getreadableDate = (date) => {
    return moment(date).format('MMMM Do YYYY')
}

const MapScreen = props => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);
    const currentJobOrderId = useSelector(state => state.currentJob.currentJobOrderId);
    const hasOrders = useSelector(state => state.profile.hasOrders);
    const currentOrder = useSelector(state => state.orders.orders.find(order => order.id === currentJobOrderId));

    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [currentLocationRegion, setCurrentLocationRegion] = useState();
    const [prosLocations, setProsLocations] = useState();
    const [isFetchingCurrentJobDetails, setIsFetchingCurrentJobDetails] = useState(true);

    useEffect(() => {
        getLocationHandler();
        fetchProLocations();
    }, []);

    useEffect(() => {
        checkIfCurrentJob();
    }, [checkIfCurrentJob]);

    useEffect(() => {
        checkIfUserHasOrderHistory();
    }, [checkIfUserHasOrderHistory]);

    useEffect(() => {
        const currentJobRef = firebase.database().ref(`orders/${userId}/${currentJobOrderId}`);
        const onChildChanged = async (dataSnapShot) => {
            //console.log(dataSnapShot.key);
            if (dataSnapShot.key === "status") {
                dispatch({
                    type: UPDATE_ORDER,
                    orderId: currentJobOrderId,
                    valueToUpdate: "status",
                    value: dataSnapShot.val()
                });
                if (dataSnapShot.val() === "in progress" || "completed"){
                    const assignedProIdSnapshot = await firebase.database().ref(`orders/${userId}/${currentJobOrderId}/assignedProId`).once("value");
                    const assignedProId = assignedProIdSnapshot.val();
                    dispatch({
                        type: UPDATE_ORDER,
                        orderId: currentJobOrderId,
                        valueToUpdate: "assignedProId",
                        value: assignedProId
                    });
                }
                if (dataSnapShot.val() === "completed") {
                    dispatch({
                        type: currentJobActions.DELETE_CURRENT_JOB
                    });
                }
            } else if (dataSnapShot.key === "assignedProId") {
                if (currentOrder && (currentOrder.orderDetails.status === "in progress" || currentOrder.orderDetails.status === "completed") && !currentOrder.orderDetails.proName && currentOrder.orderDetails.assignedProId) {
                    //console.log(currentOrder)
                    fetchProDetails(currentOrder.orderDetails.problemType, currentOrder.orderDetails.assignedProId, currentJobOrderId)
                }
            }
        }
        if (currentJobOrderId) {
            fetchCurrentJobDetails();
            currentJobRef.on("child_changed", onChildChanged);
        }

        return () => {
            currentJobRef.off("child_changed", onChildChanged);
        }

    }, [currentJobOrderId]);

    useEffect(() => {
        if (currentOrder && (currentOrder.orderDetails.status === "in progress" || currentOrder.orderDetails.status === "completed") && !currentOrder.orderDetails.proName && currentOrder.orderDetails.assignedProId) {
            //console.log(currentOrder)
            fetchProDetails(currentOrder.orderDetails.problemType, currentOrder.orderDetails.assignedProId, currentJobOrderId)
        }
    }, [currentOrder]);

    const fetchCurrentJobDetails = async () => {
        try {
            if (!currentOrder) {
                const dataSnapshot = await firebase.database().ref(`orders/${userId}/${currentJobOrderId}`).once('value');
                const resData = dataSnapshot.val();
                dispatch({
                    type: ADD_ORDER,
                    orderDetails: resData,
                    orderId: currentJobOrderId
                });
                setIsFetchingCurrentJobDetails(false);
            }
        } catch (err) {
            console.log(err);
            setIsFetchingCurrentJobDetails(false);
        }
    }

    const fetchProDetails = async (problemType, proId, orderId) => {
        await dispatch(orderActions.fetchProDetails(problemType, proId, orderId))
    }

    const checkIfCurrentJob = useCallback(async () => {
        if (userId) {
            const dataSnapshot = await firebase.database().ref(`pending_jobs/${userId}/`).once('value');
            const resData = dataSnapshot.val();
            //console.log(resData);
            if (resData) {
                dispatch({
                    type: currentJobActions.SET_CURRENT_JOB,
                    currentJobOrderId: resData.currentJobOrderId
                });
                return;
            }
            setIsFetchingCurrentJobDetails(false);
        }
    }, [userId]);

    const checkIfUserHasOrderHistory = useCallback(async () => {
        if (userId) {
            const dataSnapShot = await firebase.database().ref(`orders/${userId}`).once('value');
            const resData = dataSnapShot.val();
            //console.log(resData)
            if (resData === null) {
                dispatch({
                    type: HAS_ORDERS,
                    hasOrders: false
                });
            }
        }
    }, [userId])

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient Permissions!',
                'You need to grant locaton permissions to continue',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    }

    const getLocationHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        try {
            setIsFetchingLocation(true);
            const location = await Location.getCurrentPositionAsync({
                timeout: 5000,
            });
            //console.log(location);
            setCurrentLocationRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.256522,
                longitudeDelta: 0.250021
            });
            dispatch(locationActions.setUserLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            }));
        } catch (err) {
            console.log(err);
            Alert.alert(
                'Could not fetch location!',
                'Please try again later or pick a location on the map.',
                [{ text: 'Okay' }]
            );
        }
        setIsFetchingLocation(false);
    }

    const fetchProLocations = async () => {
        const dataSnapshot = await firebase.database().ref('pros_locations').once('value');
        const results = dataSnapshot.val();
        setProsLocations(results);
    }

    const regionChangedHandler = (region) => {
        setCurrentLocationRegion(region);
    }
    //console.log('currOrder', currentOrder);

    return (
        <Fragment>
            <MapView
                style={{ flex: 2 }}
                region={currentLocationRegion}
                showsUserLocation={true}
                loadingEnabled
                showsMyLocationButton
            //onRegionChange={regionChangedHandler}
            >
                {
                    prosLocations &&
                    prosLocations.map((proLocation, index) => (
                        <Marker title={proLocation.type} coordinate={proLocation} key={index /*will be proId later*/}>
                            <Image
                                source={require('../assets/pro-icon.png')}
                                style={{ width: 35, height: 35 }}
                            />
                        </Marker>
                    ))
                }
            </MapView>

            <Card style={{ ...styles.card, justifyContent: "center" }}>
                {isFetchingCurrentJobDetails ?
                    <Spinner /> :
                    currentOrder ?
                        <View style={{ flex: 1, justifyContent: "space-between" }}>
                            <View>
                                <Text style={{ ...defaultStyles.titleText }}>{convertToSentenceCase(currentOrder.orderDetails.problemType)} job in progress</Text>
                                <Text style={{ ...defaultStyles.bodyText, color: "#505050" }}>requested on <Text style={{ fontWeight: "bold" }}>{getreadableDate(currentOrder.orderDetails.dateRequested)}</Text></Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View>
                                    <Text style={defaultStyles.bodyText}>status: <Text style={{ color: Colors.secondary, fontWeight: "bold" }}>{convertToSentenceCase(currentOrder.orderDetails.status)}</Text></Text>
                                    {
                                        currentOrder.orderDetails.proName ?
                                            <Text style={{ ...defaultStyles.bodyText, color: "#505050" }}>Pro Name: <Text style={{ fontWeight: "bold", color: "black" }}>{currentOrder.orderDetails.proName}</Text></Text> :
                                            <Text style={{ ...defaultStyles.bodyText, color: "#505050" }}>Pro Unassigned</Text>
                                    }
                                </View>
                                {
                                    currentOrder.orderDetails.proPhone ?
                                        <TouchableOpacity
                                            onPress={() => {
                                                Linking.openURL(`tel:${currentOrder.orderDetails.proPhone}`)
                                            }}
                                            style={styles.button}
                                        >
                                            <Feather
                                                name="phone"
                                                color="white"
                                                size={25}
                                            />
                                            <Text style={{ ...defaultStyles.titleText, marginHorizontal: 10, color: "white" }}>Call Pro</Text>
                                        </TouchableOpacity> :
                                        null
                                }
                            </View>
                            <MainButton onPress={() => {
                                props.navigation.navigate('OrderDetails', {
                                    orderId: currentJobOrderId,
                                    orderTitle: `Order  ${currentJobOrderId}`,
                                    initialStatus: currentOrder.orderDetails.status
                                });
                            }}>View Job Details</MainButton>
                        </View> :
                        <View style={{ flex: 1, justifyContent: "space-between" }}>
                            <Text style={{ ...defaultStyles.titleText }}>Welcome to Jobo!</Text>
                            <Text style={defaultStyles.bodyText}>Your one-stop app for Fundis.</Text>
                            <Text style={{ ...defaultStyles.bodyText, fontWeight: 'bold' }}> User ID is: {userId}</Text>
                            {!hasOrders && <Text style={defaultStyles.bodyText}>Get 25% discount on your first order!! Valid until 03/05/2020</Text>}
                            <MainButton onPress={() => {
                                props.navigation.navigate('Services');
                            }}>View Services</MainButton>
                        </View>
                }
            </Card>

        </Fragment>

    )
};

MapScreen.navigationOptions = {
    headerShown: false,
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        //alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        padding: 20,
        flex: 1
    },
    button: {
        backgroundColor: Colors.secondary,
        height: 50,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 30,
        flexDirection: "row"
    },
})

export default MapScreen;