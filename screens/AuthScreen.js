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
    Linking
} from 'react-native';
import * as facebook from 'expo-facebook';
import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
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

    const facebookAuthHandler = async () => {
        setIsLoading(true);
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
                //console.log(token, 'expires', expires);
                // Get the user's name using Facebook's Graph API
                // const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                // const responseBody = await response.json();
                // console.log(responseBody);
                //Alert.alert('Logged in!', `Hi ${responseBody.name}!`);
                const userCredential = await firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token));
                //console.log(userCredential);
                const userId = userCredential.user.uid;
                if (userCredential.additionalUserInfo.isNewUser) {
                    const userName = userCredential.user.displayName;
                    const profilePicUrl = userCredential.user.photoURL;
                    const date = new Date().toString()
                    await firebase.database().ref(`user_profiles/${userId}`)
                        .set({
                            name: userName,
                            phone: "",
                            created_At: date,
                            profilePic: profilePicUrl
                        });
                    /*.then((res) => {
                        //console.log(res);
                        dispatch(authenticate(response.user.uid));
                    }).catch(err => {
                        throw new Error(err);
                    })*/
                }
                dispatch(authActions.authenticate(userId, true));
            } else {
                //type === 'cancel'
                setIsLoading(false);
            }
        } catch ({ message }) {
            setIsLoading(false);
            Alert.alert('Error occurred', `Facebook Login Error: ${message}`);
        }
    }

    const googleAuthHandler = async () => {
        setIsLoading(true);
        try {
            const { type, idToken, accessToken, user } = await Google.logInAsync({
                iosClientId: '606625555327-ia9u5s5plimsg7360pjp5mcu6kc9dp8m.apps.googleusercontent.com',
                androidClientId: '606625555327-904ok6kequmidff43huhnssoqkf8d16q.apps.googleusercontent.com',
                androidStandaloneAppClientId: '606625555327-k3fbrf7vf08gp2oe820c9hq69eihfddo.apps.googleusercontent.com'
            });
    
            if (type === 'success') {
                //console.log('user', user);
                const userCredential = await firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(idToken, accessToken));
                //console.log(userCredential);
                const userId = userCredential.user.uid;
                if (userCredential.additionalUserInfo.isNewUser) {
                    const userName = userCredential.user.displayName;
                    const profilePicUrl = userCredential.user.photoURL;
                    const date = new Date().toString()
                    await firebase.database().ref(`user_profiles/${userId}`)
                        .set({
                            name: userName,
                            phone: "",
                            created_At: date,
                            profilePic: profilePicUrl
                        });
                }
                dispatch(authActions.authenticate(userId, false, true));
            } else {
                // type === 'cancel'
                setIsLoading(false);
            }
        } catch ({ message }) {
            setIsLoading(false);
            Alert.alert('Error occurred', `Google Login Error: ${message}`);
        }  
    }

    const TouchableCmp = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback
    return (
        <View style={{ flex: 1, padding: 20, justifyContent: "space-between" }}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={height / 4.5} style={{ flex: 1 }}>
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
                            isLoading ? <Spinner /> :
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
                                        style={{ ...styles.authButton, backgroundColor: 'rgb(231, 59, 46)' }}
                                        onPress={() => {
                                            googleAuthHandler();
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            name="google-plus"
                                            size={30}
                                            color="white"
                                        />
                                        <Text style={{ ...styles.buttonText, marginLeft: 10 }}>{isSignUp ? 'Sign Up with Google' : 'Log In with Google'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.authButton}
                                        onPress={() => {
                                            facebookAuthHandler();
                                        }}
                                    >
                                        <FontAwesome
                                            name="facebook"
                                            size={30}
                                            color="white"
                                        />
                                        <Text style={{ ...styles.buttonText, marginLeft: 10 }}>{isSignUp ? 'Sign Up with Facebook' : 'Log In with Facebook'}</Text>
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
                    <MainButton style={{marginTop: 10}} onPress={() => { authHandler(credentials) }}>
                        {isSignUp ? 'Sign Up' : 'Log In'}
                    </MainButton> :
                    <Spinner />
            }
            <View style={{ paddingHorizontal: 30, bottom: -10 }}>
                <Text style={styles.terms}>
                    By signing up, you agree to our Terms and Conditions and
                    <Text> </Text>  
                    <Text style={{ color: "blue" }} onPress={() => Linking.openURL("https://drive.google.com/file/d/1e16-vnvBi7P0sSzomvUXRnA1pYdLPoD0/view?usp=sharing")}>
                         Privacy Policy
                    </Text>
                </Text>
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
        fontSize: 14,
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