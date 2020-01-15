import { Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ServicesScreen from '../screens/ServicesScreen';
import DetailsScreen from '../screens/DetailsScreen';
import CheckOutScreen from '../screens/CheckOutScreen';
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

export default createAppContainer(JoboStackNavigator);