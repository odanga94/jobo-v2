import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import defaultStyles from '../constants/default-styles';

const ProDetails = props => {
    return (
        <View style={styles.proDetail}>
            <Text style={defaultStyles.bodyText}>
                Estimate Duration:  <Text style={defaultStyles.titleText}>{props.estimateDuration} day (s)</Text>
            </Text>
            <Text style={defaultStyles.bodyText}>
                Needs Picture:  <Text style={defaultStyles.titleText}>{props.needsPicture.toString()}</Text>
            </Text>
            <Text style={defaultStyles.bodyText}>
                Needs Tools:  <Text style={defaultStyles.titleText}>{props.needsTools.toString()}</Text>
            </Text>
            <Text style={defaultStyles.bodyText}>
                Needs Dimensions:  <Text style={defaultStyles.titleText}>{props.needsDimensions.toString()}</Text>
            </Text>
        </View>

    )
}

const styles = StyleSheet.create({
    proDetail: {
        height: 200,
        width: '95%',
        backgroundColor: '#ccc',
        borderRadius: 10,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
});

export default ProDetails;