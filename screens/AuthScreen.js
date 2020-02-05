import React, { useState, Fragment, useReducer, useCallback } from 'react';
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
    ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';

import Input from '../components/UI/Input';
import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';
import Colors from '../constants/colors';
import DefaultStyles from '../constants/default-styles';
import * as authActions from '../store/actions/user/auth';


const { height } = Dimensions.get("window");

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        let updatedFormIsValid = true;
        const updatedValues = {
            ...state.inputValues,
            [action.inputLabel]: action.value
        };
        const updatedInputValidities = {
            ...state.inputValidities,
            [action.inputLabel]: action.isValid
        };
        for (let key in updatedInputValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key];
        }
        return {
            inputValues: updatedValues,
            inputValidities: updatedInputValidities,
            formIsValid: updatedFormIsValid
        }
    }
    return state;
}

const AuthScreen = props => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: '',
        },
        inputValidities: {
            email: false,
            password: false,
        },
        formIsValid: false
    });
    const dispatch = useDispatch();

    const inputChangeHandler = useCallback((inputLabel, value, validity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value,
            isValid: validity,
            inputLabel
        })
    }, [dispatchFormState]);

    const authHandler = async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong Input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
            return;
        }
        if (isSignUp) {
            setIsLoading(true);
            try {
                await dispatch(authActions.signUp(formState.inputValues.email, formState.inputValues.password));
                props.navigation.navigate('App');
            } catch (err) {
                Alert.alert('An error occurred!', err.message, [{ text: 'Okay' }]);
                setIsLoading(false);
            }

        } else {
            setIsLoading(true);
            try {
                await dispatch(authActions.logIn(formState.inputValues.email, formState.inputValues.password));
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
                    <Input
                        id="email"
                        label="E-mail:"
                        keyboardType="email-address"
                        required
                        email
                        autoCapitalize="none"
                        errorText="Please enter a valid email address."
                        onInputChange={inputChangeHandler}
                        initialValue="ag451157.john@gmail.com"
                        style={styles.textInput}
                    />
                    <Input
                        id="password"
                        label="Password:"
                        keyboardType="default"
                        secureTextEntry
                        required
                        minLength={6}
                        autoCapitalize="none"
                        errorText="Please enter a valid password."
                        onInputChange={inputChangeHandler}
                        initialValue="123456"
                        style={styles.textInput}
                    />
                    {
                        isSignUp ?
                            <Fragment>
                                <Input
                                    id="confirm-password"
                                    label="Confirm Password:"
                                    keyboardType="default"
                                    secureTextEntry
                                    required
                                    minLength={6}
                                    autoCapitalize="none"
                                    errorText="Passwords do not match"
                                    onInputChange={() => { }}
                                    initialValue="123456"
                                    style={styles.textInput}
                                />
                                <Input
                                    id="name"
                                    label="Name:"
                                    keyboardType="default"
                                    required
                                    minLength={5}
                                    autoCapitalize="none"
                                    errorText="Please enter a valid name."
                                    onInputChange={() => { }}
                                    initialValue="John Odanga"
                                    style={styles.textInput}
                                />
                            </Fragment>
                            : null
                    }
                </ScrollView>
            </KeyboardAvoidingView>
            {!isLoading ?
                <MainButton onPress={authHandler}>
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