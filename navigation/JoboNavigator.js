import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ServicesScreen from '../screens/ServicesScreen';
import DetailsScreen from '../screens/DetailsScreen';
import CheckOutScreen from '../screens/CheckOutScreen';

const JoboStackNavigator = createStackNavigator({
    Services: ServicesScreen,
    'Enter Details': DetailsScreen,
    'Check Out': CheckOutScreen
});

export default createAppContainer(JoboStackNavigator);