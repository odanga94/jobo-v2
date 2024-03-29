import React, { useReducer, useEffect, useCallback, useState } from 'react';
import { Text, ScrollView } from 'react-native';
import {
    ListItem,
    Left,
    Right
} from 'native-base';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import DefaultStyles from '../constants/default-styles';
import Colors from '../constants/colors';
import { IoniconHeaderButton } from '../components/UI/HeaderButton';

const ITEMS_UPDATE = 'ITEMS_UPDATE'
const ITEMS_UPDATE_ONE_SELECTABLE = 'ITEMS_UPDATE_ONE_SELECTABLE';

const itemsReducer = (state, action) => {
    if (action.type === ITEMS_UPDATE) {
        const updatedItem = {
            ...state[action.key],
            selected: action.value
        }
        return {
            ...state,
            [action.key]: updatedItem
        }
    } else if (action.type === ITEMS_UPDATE_ONE_SELECTABLE) {
        const updatedState = {};
        for(let key in state){
            if(key == action.key){
                updatedState[key] = {
                    ...state[key],
                    selected: action.value
                }
                //console.log('updated');
            } else {
                updatedState[key] = {
                    ...state[key],
                    selected: false
                }
            } 
        }
        return updatedState;
    }
    return state;
}

const ListItemsScreen = props => {
    const items = props.navigation.getParam('items');
    const alreadySelectedItems = props.navigation.getParam("alreadySelected");
    const type = props.navigation.getParam("type");
    const manySelectable = props.navigation.getParam('manySelectable');

    let initialItemsState = {};
    items.forEach((item, index) => {
        initialItemsState[index] = {
            name: item,
            selected: false
        }
    });
    const [itemsState, dispatchItemsState] = useReducer(itemsReducer, initialItemsState);

    useEffect(() => {
        if(alreadySelectedItems && Object.keys(alreadySelectedItems).length !== 0){
            Object.keys(alreadySelectedItems).forEach(key => {
                dispatchItemsState({
                    type: ITEMS_UPDATE,
                    key,
                    value: true
                });
            });    
        }
    }, [alreadySelectedItems]);

    const submitHandler = useCallback(() => {
        const selectedItems = {};
        for (let item in itemsState){
            if(itemsState[item].selected){
                selectedItems[item] = { ...itemsState[item] }
            }
        }
        props.navigation.navigate('Enter Details', { selectedItems, type })
    }, [itemsState]);

    useEffect(() => {
        props.navigation.setParams({ 'submit': submitHandler })
    }, [submitHandler]);

    //console.log(itemsState, manySelectable);

    return (
        <ScrollView>
            {
                items.map((item, index) => (
                    <ListItem
                        key={index}
                        onPress={() => {
                            if(manySelectable === "no"){
                                dispatchItemsState({
                                    type: ITEMS_UPDATE_ONE_SELECTABLE,
                                    key: index,
                                    value: !itemsState[index].selected
                                });
                                return;
                            }
                            dispatchItemsState({
                                type: ITEMS_UPDATE,
                                key: index,
                                value: !itemsState[index].selected
                            })
                        }}
                    >
                        <Left>
                            {
                                itemsState[index].selected ?
                                <Text style={{...DefaultStyles.bodyText, color: Colors.secondary}}>{item}</Text> :
                                <Text style={{...DefaultStyles.bodyText, color: "black"}}>{item}</Text> 
                            }    
                        </Left>
                        {
                            itemsState[index].selected &&
                            <Right>
                                <Ionicons name="ios-checkmark" size={23} color={Colors.secondary} />
                            </Right>
                        }
                    </ListItem>
                ))
            }
        </ScrollView>

    )
}

ListItemsScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: 'Select Items',
        headerBackTitle: 'Back',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconHeaderButton} >
                <Item
                    title='Save'
                    iconName='ios-save'
                    onPress={() => {
                        submitFn();
                    }}
                />
            </HeaderButtons>
        )
    }
}

export default ListItemsScreen;