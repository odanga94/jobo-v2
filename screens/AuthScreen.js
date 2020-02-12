import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform,
    Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';

import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';
import Colors from '../constants/colors';
import DefaultStyles from '../constants/default-styles';
import * as authActions from '../store/actions/user/auth';
import SignInWithEmailForm from '../components/SignInWithEmailForm';
import SignUpWithEmailForm from '../components/SignUpWithEmailForm';


const { height } = Dimensions.get("window");

const AuthScreen = props => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formIsValid, setFormIsValid] = useState(false);
    const [credentials, setCredentials] = useState();
    const dispatch = useDispatch();

    const authHandler = async (credentials) => {
        if (!formIsValid) {
            Alert.alert('Wrong Input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
            return;
        }
        if (isSignUp) {
            setIsLoading(true);
            try {
                await dispatch(authActions.signUp(credentials.email, credentials.password, credentials.name, credentials.phone));
                props.navigation.navigate('App');
            } catch (err) {
                Alert.alert('An error occurred!', err.message, [{ text: 'Okay' }]);
                setIsLoading(false);
            }

        } else {
            setIsLoading(true);
            try {
                await dispatch(authActions.logIn(credentials.email, credentials.password));
                props.navigation.navigate('App');
            } catch (err) {
                Alert.alert('An error occurred!', err.message, [{ text: 'Okay' }]);
                setIsLoading(false);
            }
        }
    }

    const TouchableCmp = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.screen}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={require('../assets/jobo-icon.png')} resizeMode="contain" />
                    </View>
                    <View style={styles.labelsContainer}>
                        <TouchableCmp style={{ flex: 1, height: 30 }} onPress={() => {
                            setIsSignUp(false);
                        }}>
                            <View style={{ ...styles.button, borderBottomColor: !isSignUp ? Colors.secondary : "#ccc" }} >
                                <Text style={{ ...DefaultStyles.titleText, color: !isSignUp ? Colors.secondary : '#aaa' }}>LOG IN</Text>
                            </View>
                        </TouchableCmp>
                        <TouchableCmp style={{ flex: 1, height: 30 }} onPress={() => {
                            setIsSignUp(true);
                        }} >
                            <View style={{ ...styles.button, borderBottomColor: isSignUp ? Colors.secondary : "#ccc" }} >
                                <Text style={{ ...DefaultStyles.titleText, color: isSignUp ? Colors.secondary : "#ccc" }}>SIGN UP</Text>
                            </View>
                        </TouchableCmp>
                    </View>
                    {
                        isSignUp ?
                            <SignUpWithEmailForm
                                setFormIsValid={setFormIsValid}
                                setCredentials={setCredentials}
                            /> :
                            <SignInWithEmailForm
                                setFormIsValid={setFormIsValid}
                                setCredentials={setCredentials}
                            />
                    }

                </ScrollView>
            </KeyboardAvoidingView>
            {!isLoading ?
                <MainButton onPress={() => { authHandler(credentials) }}>
                    {isSignUp ? 'Sign Up' : 'Log In'}
                </MainButton> :
                <Spinner />
            }
            <View style={{ paddingHorizontal: 30, bottom: -10 }}>
                <Text style={styles.terms}>By signing up, you agree to our Terms and Conditions and Privacy Policy</Text>
            </View>
        </View>

    )
};

const styles = StyleSheet.create({
    screen: {
        //height: '95%',
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: height / 5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
    image: {
        height: '100%',
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15
    },
    button: {
        borderBottomWidth: 3,
        flex: 1,
        alignItems: 'center'
    },
    terms: {
        textAlign: 'center',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        color: '#505050'
    },
    textInput: {
        borderColor: '#ccc',
        borderWidth: 2,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingHorizontal: 5
    }
});

AuthScreen.navigationOptions = {
    headerTitle: 'Sign In'
}

export default AuthScreen;