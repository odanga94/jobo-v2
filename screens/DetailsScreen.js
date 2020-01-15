import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import MainButton from '../components/MainButton';
import { PROS } from '../data/pros';

const DetailsScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>The Details Screen!</Text>
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