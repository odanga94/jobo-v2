import React, { useState, Fragment } from 'react';
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
import * as facebook from 'expo-facebook';
import * as firebase from 'firebase';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';
import Colors from '../constants/colors';
import DefaultStyles from '../constants/default-styles';
import * as authActions from '../store/actions/user/auth';
import SignInWithEmailForm from '../components/SignInWithEmailForm';
import SignUpWithEmailForm from '../components/SignUpWithEmailForm';


const { width, height } = Dimensions.get("window");

const AuthScreen = props => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isEmailAuth, setIsEmailAuth] = useState(false);
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

    const signInWithFacebook = async () => {
        try {
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
            });
            if (type === 'success') {
                console.log(token, 'expires', expires);
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                const responseBody = await response.json();
                console.log(responseBody);
                Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
                const userCredential = await firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token));
                console.log(userCredential);
            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            Alert.alert('Error occurred', `Facebook Login Error: ${message}`);
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
                        !isEmailAuth ?
                            <Fragment>
                                <TouchableOpacity
                                    style={{ ...styles.authButton, backgroundColor: Colors.primary }}
                                    onPress={() => {
                                        setIsEmailAuth(true);
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="email-outline"
                                        size={25}
                                        color="white"
                                    />
                                    <Text style={{ ...styles.buttonText, marginLeft: 10 }}>{isSignUp ? 'Sign Up with Email' : 'Log In with Email'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.authButton}
                                    onPress={() => {
                                        signInWithFacebook();
                                    }}
                                >
                                    <FontAwesome
                                        name="facebook"
                                        size={30}
                                        color="white"
                                    />
                                    <Text style={{ ...styles.buttonText, marginLeft: 10 }}>{isSignUp ? 'Sign Up with Facebook' : 'Log In with Facebook'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ ...styles.authButton, backgroundColor: 'rgb(231, 59, 46)' }}
                                    onPress={() => {
                                        addOrder();
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="google-plus"
                                        size={30}
                                        color="white"
                                    />
                                    <Text style={{ ...styles.buttonText, marginLeft: 10 }}>{isSignUp ? 'Sign Up with Google' : 'Log In with Google'}</Text>
                                </TouchableOpacity>
                            </Fragment>
                            :
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
            {!isEmailAuth ? null :
                !isLoading ?
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
    },
    authButton: {
        backgroundColor: 'rgb(51, 79, 141)',
        height: 50,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        flexDirection: "row",
        width: '90%',
        marginVertical: 10
    },
    buttonText: {
        color: 'white',
        fontFamily: 'poppins-regular',
        fontSize: 18,
        textAlign: 'center'
    }
});

AuthScreen.navigationOptions = {
    headerTitle: 'Sign In'
}

export default AuthScreen;