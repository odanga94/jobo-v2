import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CheckOutScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>The CheckOut Screen!</Text>
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

export default CheckOutScreen;