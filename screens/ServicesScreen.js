import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import MainButton from '../components/MainButton';
import { PROS } from '../data/pros';
import defaultStyles from '../constants/default-styles';
import colors from '../constants/colors';

const renderGridItem = (itemData) => {
    return (
        <View style={styles.gridItem}>
            <Text style={{...defaultStyles.bodyText, color: colors.secondary}}>{itemData.item.title}</Text>
        </View>
    )
}

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while(numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0){
        data.push({id: 'p' + data.length});
        numberOfElementsLastRow++;
    }
    return data;
}


const ServicesScreen = props => {
    return (
        <FlatList
            numColumns={3}
            data={formatData(PROS, 3)}
            renderItem={renderGridItem}
        />
    )
};

const styles = StyleSheet.create({
    gridItem: {
        flex: 1,
        margin: 15,
        height: 150
    }
})

export default ServicesScreen;