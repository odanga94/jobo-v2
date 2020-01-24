import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import MainButton from '../components/UI/MainButton';
import { PROS, PRO_DETAILS } from '../data/pros';
import ProDetails from '../components/ProDetails';

const DetailsScreen = props => {
    const proId = props.navigation.getParam('proId');
    const requiredDetails = PRO_DETAILS.find(detail => detail.proIds.indexOf(proId) >= 0)
    return (
        <View style={styles.screen}>
            <ProDetails
                estimateDuration={requiredDetails.estimateDuration}
                needsTools={requiredDetails.needsTools}
                needsPicture={requiredDetails.needsPicture}
                needsDimensions={requiredDetails.needsDimensions}
            />
            <MainButton
                onPress={() => {
                    props.navigation.navigate({routeName: 'Check Out'})
                }}
            >Check Out</MainButton>
        </View>
    )
};

DetailsScreen.navigationOptions = (navigationData) => {
    const proId = navigationData.navigation.getParam('proId');
    const selectedPro = PROS.find(pro => pro.id === proId)

    return {
        title: selectedPro.title
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default DetailsScreen;