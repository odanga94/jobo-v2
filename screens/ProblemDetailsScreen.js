import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import MainButton from '../components/UI/MainButton';
import { PROS, PRO_DETAILS } from '../data/pros';
import ProDetails from '../components/ProDetails';
import Plumbing from '../components/ProblemDetails/Plumbing';
import ListButton from '../components/UI/ListButton';
import DefaultStyles from '../constants/default-styles';
import fetchAddress from '../utility/fetchAddress';

const ProblemDetailsScreen = props => {
    const { navigation } =  props;

    const pickedLocationAddress = navigation.getParam('pickedLocation');

    const [clientAddress, setClientAddress] = useState('');

    const clientLocation = useSelector(state => state.location.userLocation);
 
    const proId = navigation.getParam('proId');
    const requiredDetails = PRO_DETAILS.find(detail => detail.proIds.indexOf(proId) >= 0);

    useEffect(() => {
        if (pickedLocationAddress){
            setClientAddress(pickedLocationAddress);
        }
    }, [pickedLocationAddress]);

    useEffect(() => {
        const getAddress = async () => {
            try {
                const formattedAddress = await fetchAddress(clientLocation.lat, clientLocation.lng);
                setClientAddress(formattedAddress);
            } catch (err) {
                console.log(err);
            }
        }
        if (clientLocation) {
            getAddress();
        }
    }, [clientLocation]);

    const goToLocation = () => {
        navigation.navigate(
            'Pick Location',
            { userAddress: clientAddress }
        );
    }
    return (
        <ScrollView contentContainerStyle={styles.screen}>
            <Plumbing />
            <Text style={DefaultStyles.bodyText}>Location:</Text>
            <ListButton info={clientAddress} pressedHandler={goToLocation} />
            <ProDetails
                estimateDuration={requiredDetails.estimateDuration}
                needsTools={requiredDetails.needsTools}
                needsPicture={requiredDetails.needsPicture}
                needsDimensions={requiredDetails.needsDimensions}
            />
            <MainButton
                onPress={() => {
                    navigation.navigate({routeName: 'Check Out'})
                }}
            >Check Out</MainButton>
        </ScrollView>
    )
};

ProblemDetailsScreen.navigationOptions = (navigationData) => {
    const proId = navigationData.navigation.getParam('proId');
    const selectedPro = PROS.find(pro => pro.id === proId)

    return {
        title: selectedPro.title
    }
}

const styles = StyleSheet.create({
    screen: {
        width: '100%',
        backgroundColor: 'white', 
        padding: 10
    }
})

export default ProblemDetailsScreen;