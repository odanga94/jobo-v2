import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableNativeFeedback,
    Image
} from 'react-native';

import DefaultStyles from '../constants/default-styles';

const ProGridTile = props => {
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }

    return (
        <View style={styles.gridItem}>
            <TouchableCmp
                onPress={props.onSelect}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>
                    <Image
                        source={props.imgSrc}
                        style={styles.image}
                    />
                    <Text style={styles.title}>{props.title}</Text>
                </View>
            </TouchableCmp>
        </View>
    )
}

const styles = StyleSheet.create({
    gridItem: {
        flex: 1,
        margin: 5,
        height: 150,
        borderRadius: 10,
        overflow: 'hidden'
    },
    container: {
        flex: 1,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 3,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    title: {
        ...DefaultStyles.bodyText,
        fontSize: 16,
        textAlign: 'center'
    },
    image: {
        width: 100,
        height: 100,
        margin: 5
    }
});

export default ProGridTile;
