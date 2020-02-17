import React, { 
    useState, 
    useEffect, 
    Fragment, 
    useCallback,
    useReducer
 } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Alert,
    Image,
    TouchableOpacity
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import  * as Permissions from 'expo-permissions';
import * as ImgPicker from 'expo-image-picker';

import * as authActions from '../store/actions/user/auth';
import * as profileActions from '../store/actions/user/profile';
import MainButton from '../components/UI/MainButton';
import Spinner from '../components/UI/Spinner';
import Colors from '../constants/colors';
import DefaultStyles from '../constants/default-styles';
import { MaterialHeaderButton } from '../components/UI/HeaderButton';
import Input from '../components/UI/Input';

const { height, width } = Dimensions.get('window');

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
const ProfileScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [pickedImage, setPickedImage] = useState();
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: '',
            phone: ''
        },
        inputValidities: {
            name: false,
            phone: false,
        },
        formIsValid: false
    });

    const userId = useSelector(state => state.auth.userId);
    const { name, phone, imageUri } = useSelector(state => state.profile);
    const dispatch = useDispatch();
    

    const logOutHandler = async () => {
        setIsLoading(true);
        await dispatch(authActions.logOut());
        props.navigation.navigate('Auth');
    }

    const toggleEditMode = useCallback(value => {
        setPickedImage(null);
        if (value === false) {
            setIsEditMode(false);
            return;
        }
        setIsEditMode(true);
    }, []);

    useEffect(() => {
        props.navigation.setParams({ 'edit': toggleEditMode })
    }, [toggleEditMode])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setProfileLoading(true);
                const userData = await dispatch(profileActions.fetchProfile(userId));
                dispatchFormState({
                    type: FORM_INPUT_UPDATE,
                    value: userData.name,
                    isValid: true,
                    inputLabel: "name"
                });
                dispatchFormState({
                    type: FORM_INPUT_UPDATE,
                    value: userData.phone,
                    isValid: true,
                    inputLabel: "phone"
                });
            } catch (err) {
                Alert.alert('An error occurred!', err.message, [{ text: 'Okay' }]);
            }
            setProfileLoading(false);
        }
        fetchProfile();
    }, [dispatch, userId]);

    const inputChangeHandler = useCallback((inputLabel, value, validity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value,
            isValid: validity,
            inputLabel
        });
    }, [dispatchFormState]);

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient Permissions!',
                'You need to grant camera permissions to take a picture',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    }
    const takePictureHandler = async () => {
        if (!isEditMode) {
            return;
        }
        const hasPermissions = await verifyPermissions();
        if (!hasPermissions) {
            return;
        }
        const image = await ImgPicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5
        });
        if (image.uri) {
            setPickedImage(image.uri);
        }
    }

    const saveProfileHandler = async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong Input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
            return;
        }
        try {
            setIsEditMode(false);
            setProfileLoading(true);
            let userData = formState.inputValues;
            if (pickedImage){
                userData = {
                    ...formState.inputValues,
                    imageUri: pickedImage
                }
            }
            await dispatch(profileActions.editProfile(userId, userData));
        } catch (err){
            Alert.alert('An error occurred!', err.message, [{ text: 'Okay' }]);
        }
        setProfileLoading(false);
    }

    return (
        <View style={styles.screen}>
            <View>
                <View style={styles.profileContainer}>
                    <View>
                        <View style={styles.imageContainer} >
                            {
                                imageUri ?
                                    <Image source={{ uri: imageUri }} style={styles.image} /> :
                                    <Ionicons size={height / 8} name="ios-person" color="#505050" />
                            }
                        </View>
                        {
                            isEditMode ?
                                <TouchableOpacity style={{ alignSelf: "center" }} onPress={takePictureHandler}>
                                    <MaterialCommunityIcons size={23} color={Colors.secondary} name="image-plus" />
                                </TouchableOpacity> :
                                null
                        }

                    </View>
                    <View style={styles.infoContainer}>
                        {profileLoading ?
                            <Spinner /> :
                            isEditMode ?
                                <Fragment>
                                    <Input
                                        id="name"
                                        label="Name:"
                                        keyboardType="default"
                                        required
                                        minLength={3}
                                        autoCapitalize="none"
                                        errorText="Please enter a valid name."
                                        onInputChange={inputChangeHandler}
                                        initialValue={name ? name : ""}
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
                                        initialValue={phone ? phone : ""}
                                        style={styles.textInput}
                                    />
                                </Fragment>
                                :
                                <Fragment>
                                    <Text style={{ ...DefaultStyles.bodyText, fontSize: 16 }}>{name ? name : ""}</Text>
                                    <Text style={{ ...DefaultStyles.bodyText, fontSize: 16 }}>{phone ? phone : ""}</Text>
                                </Fragment>
                        }
                    </View>
                </View>
                {
                    isEditMode ?
                        <View style={styles.buttonsContainer}>
                            <MainButton
                                onPress={() => {
                                    setIsEditMode(false);
                                }}
                                style={{ backgroundColor: 'red', width: width / 2.5, height: 50 }}
                            >
                                Cancel
                        </MainButton>
                            <MainButton
                                style={{ width: width / 2.5, height: 50 }}
                                onPress={() => {
                                    saveProfileHandler()
                                }}
                            >
                                Save
                        </MainButton>
                        </View> :
                        null
                }
            </View>
            {isLoading ?
                <Spinner /> :
                <MainButton onPress={logOutHandler}>
                    Sign Out
                </MainButton>
            }
        </View>
    )
};

ProfileScreen.navigationOptions = navData => {
    const editFn = navData.navigation.getParam('edit')
    return {
        headerTitle: "My Profile",
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={MaterialHeaderButton} >
                <Item
                    title='Edit'
                    iconName='account-edit'
                    onPress={() => {
                        editFn(true);
                    }}
                />
            </HeaderButtons>
        ),
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        height: height,
        width: '100%',
        justifyContent: 'space-between'
    },
    profileContainer: {
        flexDirection: 'row',
        marginBottom: 20
    },
    imageContainer: {
        width: height / 7,
        height: height / 7,
        borderRadius: 150,
        borderWidth: 3,
        borderColor: Colors.secondary,
        overflow: "hidden",
        alignItems: "center",
        marginVertical: 3,
        backgroundColor: "#ccc"
    },
    infoContainer: {
        marginLeft: 15,
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        //width: '100%',
        justifyContent: 'space-between'
    },
    textInput: {
        paddingRight: 40
    }
})

export default ProfileScreen;