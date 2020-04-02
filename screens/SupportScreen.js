import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { IoniconHeaderButton } from '../components/UI/HeaderButton';
import MainButton from '../components/UI/MainButton';
import DefaultStyles from '../constants/default-styles';

const SupportScreen = props => {
        return (
            <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20}}>
                <Text style={DefaultStyles.titleText}>You haven't raised any issues yet.</Text>
                <MainButton
                    style={{marginTop: 10}}
                    onPress={() => {}}
                >Add Support Ticket</MainButton>
            </View>
        );  
};

SupportScreen.navigationOptions = navData => {
    return {
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconHeaderButton} >
                <Item
                    title='Add Ticket'
                    iconName='ios-add'
                    onPress={() => {
                        
                    }}
                />
            </HeaderButtons>
        ),
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SupportScreen;