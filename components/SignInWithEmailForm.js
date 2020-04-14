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

const SignInWithEmailForm = props => {
    const { setFormIsValid, setCredentials } = props;
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
        setCredentials({...formState.inputValues});
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
                initialValue=""
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
                initialValue=""
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

export default SignInWithEmailForm;
