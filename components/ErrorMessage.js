import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import MainButton from './UI/MainButton';

const ErrorMessage = props => {
    return (
        <View style={styles.centered}>
            <Text style={{ fontFamily: 'poppins-bold', fontSize: 18, textAlign: 'center', marginBottom: 10 }}>
                {props.error}
            </Text>
            <MainButton onPress={props.retry}>
                Try Again
            </MainButton>
        </View>
    )
}

const styles = StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20
    }
});

export default ErrorMessage;