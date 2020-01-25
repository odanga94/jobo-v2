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
import OrdersScreen from '../screens/OrdersScreen';
import SupportScreen from '../screens/SupportScreen';
import MapScreen from '../screens/MapScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import Colors from '../constants/colors';

const defaultStackNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
    headerTitleStyle: {
        fontFamily: 'poppins-regular',
        fontWeight: 'bold'
    }
}

const HomeStackNavigator = createStackNavigator({
    Map: MapScreen,
    Services: ServicesScreen,
    'Enter Details': DetailsScreen,
    'Check Out': CheckOutScreen,
}, {
    defaultNavigationOptions: defaultStackNavOptions
});

const OrdersStackNavigator = createStackNavigator({
    'Your Orders': OrdersScreen,
    OrderDetails: OrderDetailsScreen
}, {
    defaultNavigationOptions: defaultStackNavOptions
});

const SupportStackNavigator = createStackNavigator({
    'Support': SupportScreen
}, {
    defaultNavigationOptions: defaultStackNavOptions
});

const ProfileStackNavigator = createStackNavigator({
    'My Profile': ProfileScreen
}, {
    defaultNavigationOptions: defaultStackNavOptions
});

const JoboTabNavigator = createBottomTabNavigator({
    Home: {
        screen: HomeStackNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <FontAwesome name="home" size={30} color={tabInfo.tintColor} />
            },
        }
    },
    'My Orders': {
        screen: OrdersStackNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <MaterialIcons name="history" size={30} color={tabInfo.tintColor} />
            }
        }
    },
    Support: {
        screen: SupportStackNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <MaterialIcons name="help-outline" size={30} color={tabInfo.tintColor} />
            }
        }
    },
    Profile: {
        screen: ProfileStackNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <Ionicons name="md-person" size={30} color={tabInfo.tintColor} />
            }
        }
    }
}, {
    tabBarOptions: {
        activeTintColor: Colors.secondary,
        style: {
            backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
        },
        labelStyle: {
            fontFamily: 'poppins-regular'
        }
    },
});


export default createAppContainer(JoboTabNavigator);