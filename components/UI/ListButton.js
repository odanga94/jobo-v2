import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import DefaultStyles from '../../constants/default-styles';
import Colors from '../../constants/colors';

const ListButton = props => {
    return (
        <TouchableOpacity onPress={props.pressedHandler} style={styles.button}>
            <Text style={{ ...DefaultStyles.bodyText, color: Colors.secondary }}>{props.info}</Text>
            <AntDesign name="right" size={18} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopColor: '#ccc',
        borderBottomColor: '#ccc',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 7.5
    }
});

export default ListButton;