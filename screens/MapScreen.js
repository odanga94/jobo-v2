import React, { Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import Card from '../components/Card';
import MainButton from '../components/MainButton';
import defaultStyles from '../constants/default-styles';

const MapScreen = props => {
    const isAuthenticated = useSelector(state => state.auth.isAuth);
    console.log(isAuthenticated);
    return (
        <Fragment>
            <View style={styles.map}>
                <Text>MapView area</Text>
            </View>
            <Card style={styles.card}>
    <Text style={{...defaultStyles.bodyText, fontWeight: 'bold'}}> User is Authenticated: {isAuthenticated.toString()}</Text>
                <Text style={defaultStyles.bodyText}>Some Content like announcements and current job</Text>
                <MainButton onPress={() => {
                    props.navigation.navigate('Services');
                }}>View Services</MainButton>
            </Card>
        </Fragment>

    )
};

MapScreen.navigationOptions = {
    headerShown: false
}

const styles = StyleSheet.create({
    map: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        flex: 1,
        width: '95%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        alignSelf: 'center'
    }
})

export default MapScreen;