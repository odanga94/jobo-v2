import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/user/auth';

import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';

const ProfileScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const logOutHandler = async () => {
        setIsLoading(true);
        await dispatch(authActions.logOut());
        //setIsLoading(false);
        props.navigation.navigate('Auth');
    }

    return (
        <View style={styles.screen}>
            <Text>The Profile Screen!</Text>
            {isLoading ?
                <Spinner /> :
                <MainButton onPress={logOutHandler}>
                    Sign Out
                </MainButton>
            }
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProfileScreen;