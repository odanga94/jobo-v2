import React, { useReducer, Fragment, useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import Input from './UI/Input';

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

const SignUpWithEmailForm = props => {
    const { setFormIsValid, setCredentials } = props;
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            phone: ''
        },
        inputValidities: {
            email: false,
            password: false,
        },
        formIsValid: false
    });

    const inputChangeHandler = useCallback((inputLabel, value, validity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value,
            isValid: validity,
            inputLabel
        });
    }, [dispatchFormState]);

    useEffect(() => {
        setFormIsValid(formState.formIsValid);
        setCredentials({ ...formState.inputValues });
    }, [formState, setFormIsValid, setCredentials]);

    return (
        <Fragment>
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
            <Input
                id="confirmPassword"
                label="Confirm Password:"
                passwordValue={formState.inputValues.password}
                keyboardType="default"
                secureTextEntry
                required
                autoCapitalize="none"
                errorText="Passwords do not match"
                onInputChange={inputChangeHandler}
                initialValue="123456"
                style={styles.textInput}
            />
            <Input
                id="name"
                label="Name:"
                keyboardType="default"
                required
                minLength={3}
                autoCapitalize="none"
                errorText="Please enter a valid name."
                onInputChange={inputChangeHandler}
                initialValue="John Odanga"
                style={styles.textInput}
            />
            <Input
                id="phone"
                label="Phone:"
                keyboardType="phone-pad"
                required
                minLength={10}
                maxLength={10}
                autoCapitalize="none"
                errorText="Please enter a valid phone number."
                onInputChange={inputChangeHandler}
                initialValue="0799848807"
                style={styles.textInput}
            />
        </Fragment>
    )
}

const styles = StyleSheet.create({
    textInput: {
        borderColor: '#ccc',
        borderWidth: 2,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingHorizontal: 5
    }
})

export default SignUpWithEmailForm;
