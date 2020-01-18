import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons, MaterialIcons, FontAwesome} from '@expo/vector-icons';

import ServicesScreen from '../screens/ServicesScreen';
import DetailsScreen from '../screens/DetailsScreen';
import CheckOutScreen from '../screens/CheckOutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import SupportScreen from '../screens/SupportScreen';
import Colors from '../constants/colors';

const JoboStackNavigator = createStackNavigator({
    Services: ServicesScreen,
    'Enter Details': DetailsScreen,
    'Check Out': CheckOutScreen
}, {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
        },
        headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
    }
});

const JoboTabNavigator = createBottomTabNavigator({
    Home: {
        screen: JoboStackNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <FontAwesome name="home" size={30} color={tabInfo.tintColor} />
            }
        }
    },
    'Order History': {
        screen: OrderHistoryScreen,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <MaterialIcons name="history" size={30} color={tabInfo.tintColor} />
            }
        }
    },
    Support: {
        screen: SupportScreen,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <MaterialIcons name="help-outline" size={30} color={tabInfo.tintColor} />
            }
        }
    },
    Profile: {
        screen: ProfileScreen,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <Ionicons name="md-person" size={30} color={tabInfo.tintColor} />
            }
        }
    }
}, {
    tabBarOptions: {
        activeTintColor: Colors.secondary
    }
})

export default createAppContainer(JoboTabNavigator);