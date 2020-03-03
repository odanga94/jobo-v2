import React, { Fragment, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import Card from '../components/UI/Card';
import MainButton from '../components/UI/MainButton';
import defaultStyles from '../constants/default-styles';
import * as locationActions from '../store/actions/location';

const { height } = Dimensions.get('window');

const MapScreen = props => {
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [currentLocationRegion, setCurrentLocationRegion] = useState();

    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);

    let markerCoordinate = {
        latitude:  -1.2734374,
        longitude: 36.7193039,
    }

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
                latitudeDelta: 0.012522,
                longitudeDelta: 0.0021
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

    useEffect(() => {
        getLocationHandler();
    }, [])

    return (
        <Fragment>
            <MapView
                style={{ flex: 1 }}
                region={currentLocationRegion}
                showsUserLocation={true}
            >
                {markerCoordinate && <Marker title="Picked Location" coordinate={markerCoordinate}></Marker>}
            </MapView>
            <Card style={styles.card}>
                <Text style={{ ...defaultStyles.bodyText, fontWeight: 'bold' }}> User ID is: {userId}</Text>
                <Text style={defaultStyles.bodyText}>Get 25% discount on your next order!! Valid until 03/04/2020</Text>
                <MainButton onPress={() => {
                    props.navigation.navigate('Services');
                }}>View Services</MainButton>
            </Card>
        </Fragment>

    )
};

MapScreen.navigationOptions = {
    headerShown: false,
}

const styles = StyleSheet.create({
    card: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        padding: 20,
        position: "absolute",
        bottom: 5,
        height: height / 3
    }
})

export default MapScreen;