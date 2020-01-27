import React, { Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import Card from '../components/UI/Card';
import MainButton from '../components/UI/MainButton';
import defaultStyles from '../constants/default-styles';

const MapScreen = props => {
    const isAuthenticated = useSelector(state => state.auth.isAuth);
    return (
        <Fragment>
            <View style={styles.map}>
                <Text>MapView area</Text>
            </View>
            <Card style={styles.card}>
                <Text style={{ ...defaultStyles.bodyText, fontWeight: 'bold' }}> User is Authenticated: {isAuthenticated.toString()}</Text>
                <Text style={defaultStyles.bodyText}>Some Content like announcements and current job</Text>
                <MainButton onPress={() => {
                    props.navigation.navigate('Services');
                }}>View Services</MainButton>
            </Card>
        </Fragment>

    )
};

MapScreen.navigationOptions = {
    headerShown: false,
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
        alignSelf: 'center',
        padding: 20
    }
})

export default MapScreen;