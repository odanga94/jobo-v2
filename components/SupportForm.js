import React, { useReducer, useCallback, useState, Fragment } from 'react';
import {
    Modal,
    View,
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
    Alert,
    Platform,
    Text,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import { Picker, Item, Icon } from 'native-base';

import Input from '../components/UI/Input';
import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';

const { width } = Dimensions.get('window');

const initialFormState = {
    inputValues: {
        subject: '',
        description: ''
    },
    inputValidities: {
        subject: false,
        description: false,
    },
    formIsValid: false
}

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const RESET_FORM = 'RESET_FORM'
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
    } else if (action.type === RESET_FORM) {
        return initialFormState;
    }
    return state;
}

const SupportForm = props => {
    const [category, setCategory] = useState();
    const [addTicketLoading, setAddTicketLoading] = useState(false);
    const [addTicketErr, setAddTicketErr] = useState();
    const [formState, dispatchFormState] = useReducer(formReducer, initialFormState);

    const inputChangeHandler = useCallback((inputLabel, value, validity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value,
            isValid: validity,
            inputLabel
        });
    }, [dispatchFormState]);

    const submitFormHandler = async () => {
        if (!category) {
            Alert.alert('Missing Input!', 'Please select a category for your ticket.', [{ text: 'Okay' }]);
            return;
        }
        if (!formState.formIsValid) {
            Alert.alert('Wrong Input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
            return;
        }
        setAddTicketLoading(true);
        try {
            await props.addTicket(category, formState.inputValues.subject, formState.inputValues.description);
            setAddTicketLoading(false);
            dispatchFormState({
                type: RESET_FORM
            });
            setCategory();
            props.pressed();
        } catch (err) {
            Alert.alert('An error occurred! Try again later.', err.message, [{ text: 'Okay' }]);
            setAddTicketLoading(false);
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.formVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}
        >
            <TouchableWithoutFeedback onPress={props.pressed} >
                <View style={styles.container}>
                    <TouchableWithoutFeedback>
                        <View style={styles.formContainer}>
                            {
                                addTicketLoading ? <Spinner /> :
                                    <Fragment>
                                        {Platform.OS === "android" ? <Text style={styles.label}>Select Category :</Text> : <Text style={styles.label}>Category :</Text>}
                                        <Item picker style={styles.picker}>
                                            {Platform.OS === "android" ?
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    // style={styles.picker}
                                                    placeholder="Select Category"
                                                    placeholderStyle={{ color: "#505050" }}
                                                    placeholderIconColor="#007aff"
                                                    selectedValue={category}
                                                    onValueChange={(value) => setCategory(value)}
                                                >
                                                    <Picker.Item label="" value={undefined} />
                                                    <Picker.Item label="General Inquiry" value="General Inquiry" />
                                                    <Picker.Item label="Order Issue" value="Order Issue" />
                                                    <Picker.Item label="My Account" value="My Account" />
                                                    <Picker.Item label="Payments" value="Payments" />
                                                    <Picker.Item label="Other" value="Other" />
                                                </Picker> :
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    // style={styles.picker}
                                                    placeholder="Select Category"
                                                    placeholderStyle={{ color: "#bfc6ea" }}
                                                    placeholderIconColor="#007aff"
                                                    selectedValue={category}
                                                    onValueChange={(value) => setCategory(value)}
                                                >
                                                    <Picker.Item label="General Inquiry" value="General Inquiry" />
                                                    <Picker.Item label="Order Issue" value="Order Issue" />
                                                    <Picker.Item label="My Account" value="My Account" />
                                                    <Picker.Item label="Payments" value="Payments" />
                                                    <Picker.Item label="Other" value="Other" />
                                                </Picker>
                                            }
                                        </Item>
                                        <Input
                                            id="subject"
                                            label="Subject :"
                                            keyboardType="default"
                                            required
                                            minLength={3}
                                            autoCapitalize="none"
                                            errorText="Please enter a valid value for subject."
                                            onInputChange={inputChangeHandler}
                                            initialValue=""
                                            style={styles.textInput}
                                        />
                                        <Input
                                            id="description"
                                            label='Description :'
                                            errorText='Please enter a valid description'
                                            autoCapitalize='sentences'
                                            returnKeyType='done'
                                            multiline
                                            numberOfLines={3}
                                            onInputChange={inputChangeHandler}
                                            initialValue=""
                                            required
                                            minLength={5}
                                            style={styles.textInput}
                                        />
                                        <View style={styles.buttonsContainer}>
                                            <MainButton
                                                onPress={() => {
                                                    dispatchFormState({
                                                        type: RESET_FORM
                                                    });
                                                    setCategory();
                                                    props.pressed();
                                                }}
                                                style={{ width: width / 3, backgroundColor: '#ff726f', height: 50 }}
                                            >
                                                Cancel
                                        </MainButton>
                                            <MainButton
                                                style={{ width: width / 3, height: 50 }}
                                                onPress={() => {
                                                    submitFormHandler()
                                                }}
                                            >
                                                Submit
                                        </MainButton>
                                        </View>
                                    </Fragment>
                            }
                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </TouchableWithoutFeedback>

        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        alignItems: "center",
        justifyContent: "center"
    },
    formContainer: {
        backgroundColor: "#f5f5f5",
        width: '85%',
        padding: 20,
    },
    textInput: {
        paddingVertical: 2.5,
        marginBottom: 10,
        marginTop: -5
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },
    picker: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
        marginBottom: 10
    },
    label: {
        fontFamily: 'poppins-bold',
        marginVertical: 4
    },
});

export default SupportForm;