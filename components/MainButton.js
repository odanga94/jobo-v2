import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/colors';

const MainButton = props => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{props.children}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.secondary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30
    },
    buttonText: {
        color: 'white',
        fontFamily: 'poppins-regular',
        fontSize: 18
    }
});

export default MainButton;