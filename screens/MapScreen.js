import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>The Map Screen!</Text>
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

export default MapScreen;