import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Text, StyleSheet, Alert, Image, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import * as firebase from 'firebase';
import moment from 'moment';

import Card from '../components/UI/Card';
import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';
import defaultStyles from '../constants/default-styles';
import * as locationActions from '../store/actions/location';
import * as currentJobActions from '../store/actions/currentJob';
import { ADD_ORDER, UPDATE_ORDER } from '../store/actions/orders';
import Colors from '../constants/colors';
//import prosLocs from '../data/markers';

const convertToSentenceCase = str => str.charAt(0).toUpperCase() + str.slice(1);
const getreadableDate = (date) => {
    return moment(date).format('MMMM Do YYYY')
}

const MapScreen = props => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);
    const currentJobOrderId = useSelector(state => state.currentJob.currentJobOrderId);

    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [currentLocationRegion, setCurrentLocationRegion] = useState();
    const [prosLocations, setProsLocations] = useState();
    const [currentJobDetails, setCurrentJobDetails] = useState();
    const [isFetchingCurrentJobDetails, setIsFetchingCurrentJobDetails] = useState(true);

    useEffect(() => {
        getLocationHandler();
        fetchProLocations();
    }, []);

    useEffect(() => {
        checkIfCurrentJob();
    }, [checkIfCurrentJob])

    useEffect(() => {
        const currentJobRef = firebase.database().ref(`orders/${userId}/${currentJobOrderId}`);
        const onChildChanged = (dataSnapShot) => {
            if(dataSnapShot.key === "status"){
                setCurrentJobDetails(currState => {
                    return {
                        ...currState,
                        status: dataSnapShot.val()
                    }
                });
                dispatch({
                    type: UPDATE_ORDER,
                    orderId: currentJobOrderId,
                    valueToUpdate: "status",
                    value: dataSnapShot.val()
                });
                
            };
        }
        if (currentJobOrderId){
            fetchCurrentJobDetails();
            currentJobRef.on("child_changed", onChildChanged);
        }

        return () => {
            currentJobRef.off("child_changed", onChildChanged);
        }
        
    }, [currentJobOrderId]);

    const fetchCurrentJobDetails = async () => {
        //setIsFetchingCurrentJobDetails(true);
        const dataSnapshot = await firebase.database().ref(`orders/${userId}/${currentJobOrderId}`).once('value');
        const resData = dataSnapshot.val();
        setCurrentJobDetails(resData);
        setIsFetchingCurrentJobDetails(false);
        dispatch({
            type: ADD_ORDER,
            orderDetails: resData,
            orderId: currentJobOrderId
        });
        //console.log(resData);
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
            }
        }
    }, [userId]);

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
                    currentJobDetails ?
                        <View style={{ flex: 1, justifyContent: "space-between" }}>
                            <View>
                                <Text style={{ ...defaultStyles.titleText }}>{convertToSentenceCase(currentJobDetails.problemType)} job in progress</Text>
                                <Text style={{ ...defaultStyles.bodyText, color: "#505050" }}>requested on <Text style={{ fontWeight: "bold" }}>{getreadableDate(currentJobDetails.dateRequested)}</Text></Text>
                            </View>
                            <View>
                                <Text style={defaultStyles.bodyText}>status: <Text style={{ color: Colors.secondary, fontWeight: "bold" }}>{convertToSentenceCase(currentJobDetails.status)}</Text></Text>
                                <Text style={{ ...defaultStyles.bodyText, color: "#505050" }}>Pro Name: <Text style={{ fontWeight: "bold" }}>John Odanga</Text></Text>
                            </View>
                            <MainButton onPress={() => {
                                props.navigation.navigate('OrderDetails', {
                                        orderId: currentJobOrderId,
                                        orderTitle: `Order  ${currentJobOrderId}`,
                                });
                            }}>View Job Details</MainButton>
                        </View> :
                        <Fragment>
                            <Text style={{ ...defaultStyles.bodyText, fontWeight: 'bold' }}> User ID is: {userId}</Text>
                            <Text style={defaultStyles.bodyText}>Get 25% discount on your next order!! Valid until 03/04/2020</Text>
                            <MainButton onPress={() => {
                                props.navigation.navigate('Services');
                            }}>View Services</MainButton>
                        </Fragment>
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
    }
})

export default MapScreen;