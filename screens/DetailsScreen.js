import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import MainButton from '../components/MainButton';

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

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default DetailsScreen;