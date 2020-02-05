import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';
import * as firebase from 'firebase';

import Colors from '../constants/colors';
import * as authActions from '../store/actions/user/auth';

const StartUpScreen = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuthStatus = async () => {
            await firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    //console.log(user, 'Auth state is preserved in firebase');
                    dispatch(authActions.authenticate(user.uid));
                    props.navigation.navigate('App');
                } else {
                    props.navigation.navigate('Auth');
                }
            }, error => {
                console.log(error);
                //return error;
            });
        }
        checkAuthStatus();
    }, [dispatch]);

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Image source={require('../assets/splash.png')} style={styles.image} />
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.secondary} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        position: "absolute",
        bottom: Dimensions.get("window").height / 6
    },
    image: {
        width: '100%',
        height: '100%'
    }
})

export default StartUpScreen;

