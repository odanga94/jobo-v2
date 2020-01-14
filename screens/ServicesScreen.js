import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import MainButton from '../components/MainButton';

const ServicesScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>The Services Screen!</Text>
            <MainButton
                onPress={() => {
                    props.navigation.navigate({routeName: 'Enter Details'})
                }}
            >Go to Details</MainButton>
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ServicesScreen;