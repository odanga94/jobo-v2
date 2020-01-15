import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { PROS } from '../data/pros';
import ProGridTile from '../components/ProGridTile';

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push({ id: 'p' + (data.length + 1) });
        numberOfElementsLastRow++;
    }
    return data;
}


const ServicesScreen = props => {
    const renderGridItem = (itemData) => {
        return (
            <ProGridTile
                title={itemData.item.title}
                imgSrc={itemData.item.imgSrc}
                onSelect={() => {
                    props.navigation.navigate({
                        routeName: 'Enter Details',
                        params: {
                            proId: itemData.item.id
                        }
                    })
                }}
            />
    
        )
    }
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