import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import Colors from '../../constants/colors';

const Spinner = props => {
    return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20
    }
});

export default Spinner;