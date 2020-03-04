import React, { Fragment, useState, useEffect } from 'react';
import { Text, StyleSheet, Alert, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import * as firebase from 'firebase';

import Card from '../components/UI/Card';
import MainButton from '../components/UI/MainButton';
import defaultStyles from '../constants/default-styles';
import * as locationActions from '../store/actions/location';
//import prosLocs from '../data/markers';

const MapScreen = props => {
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [currentLocationRegion, setCurrentLocationRegion] = useState();
    const [prosLocations, setProsLocations] = useState();

    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);

    useEffect(() => {
        getLocationHandler();
        fetchProLocations();
    }, [])

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
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        padding: 20,
        flex: 1
    }
})

export default MapScreen;