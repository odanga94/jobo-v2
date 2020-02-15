import React from 'react';
import { Platform } from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../../constants/colors';

export const IoniconHeaderButton = props => {
    return (
        <HeaderButton
            {...props}
            IconComponent={Ionicons}
            iconSize={23}
            color={Platform.OS === 'android' ? 'white' : Colors.primary}
        />
    );
}

export const MaterialHeaderButton = props => {
    return (
        <HeaderButton
            {...props}
            IconComponent={MaterialCommunityIcons}
            iconSize={27}
            color={Platform.OS === 'android' ? 'white' : Colors.primary}
        />
    );
}

