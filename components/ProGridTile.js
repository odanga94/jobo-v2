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

import Colors from '../constants/colors';
import DefaultStyles from '../constants/default-styles';

const ProGridTile = props => {
    let imgSrc
    switch (props.title) {
        case 'Plumber':
            imgSrc = require('../assets/pro-images/Plumber.png');
            break;
        case 'Cleaner':
            imgSrc = require('../assets/pro-images/Cleaner.png');
            break;
        case 'Electrician':
            imgSrc = require('../assets/pro-images/Electrician.png');
            break;
        case 'Beauty':
            imgSrc = require('../assets/pro-images/Beauty.png');
            break;
        case 'Moving':
            imgSrc = require('../assets/pro-images/Moving.png');
            break;
        case 'Gardener':
            imgSrc = require('../assets/pro-images/Gardener.png');
            break;
        case 'Cook':
            imgSrc = require('../assets/pro-images/Cook.png');
            break;
        case 'Painter':
            imgSrc = require('../assets/pro-images/Painter.png');
            break;
        case 'Carpenter':
            imgSrc = require('../assets/pro-images/Carpenter.png');
            break;
        case 'Taxes':
            imgSrc = require('../assets/pro-images/Taxes.png');
            break;
        case 'IT Technician':
            imgSrc = require('../assets/pro-images/IT-Technician.png');
            break;
        case 'Pest Control':
            imgSrc = require('../assets/pro-images/Pest-Control.png');
            break;
    }
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
                    {<Image
                        source={imgSrc}
                        style={styles.image}
                    />}
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
