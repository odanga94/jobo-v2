import React, { useState, useEffect, Fragment } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    Alert,
    Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import MainButton from '../components/UI/MainButton';
import ListButton from '../components/UI/ListButton';
import ImagePicker from '../components/ImagePicker';
import Spinner from '../components/UI/Spinner';

import DefaultStyles from '../constants/default-styles';
import { fetchAddress } from '../shared/functions';
import {
    PlumbingDetails,
    CleaningDetails,
    ElectricalDetails,
    PaintingDetails,
    BeautyDetails,
    MovingDetails,
    ITDetails,
    PestControlDetails,
    GardeningDetails,
    CookingDetails,
    TaxDetails,
    CarpentryDetails,
    WellnessDetails,
    EventsDetails,
    BuilderDetails,
    TilesDetails,
    GraphicDesignDetails
} from '../data/problem-details';
import * as profileActions from '../store/actions/user/profile';
import colors from '../constants/colors';


const { width, height } = Dimensions.get('window');

const ProblemDetailsScreen = props => {
    const { navigation } = props;
    const userId = useSelector(state => state.auth.userId);
    const phoneNumber = useSelector(state => state.profile.phone)

    const proId = navigation.getParam('proId');
    const pickedLocationAddress = navigation.getParam('pickedLocationAddress');
    const pickedLocation = navigation.getParam('pickedLocation');
    const selectedItems = navigation.getParam('selectedItems');
    const type = navigation.getParam('type');

    const [problems, setProblems] = useState();
    const [partsthatNeedWork, setPartsthatNeedWork] = useState();
    const [roomsThatNeedWork, setRoomsThatNeedWork] = useState();
    const [buildingType, setBuildingType] = useState();
    const [equipmentNeeded, setEquipmentNeeded] = useState();
    const [serviceNeeded, setServiceNeeded] = useState();
    const [proGender, setProGender] = useState();
    const [bucketsOfClothes, setBucketsOfClothes] = useState();
    const [mealDescription, setMealDescription] = useState();
    const [numberOfPeople, setNumberOfPeople] = useState();
    const [clientAddress, setClientAddress] = useState('');
    const [optionalInfo, setOptionalInfo] = useState('');
    const [problemImage, setProblemImage] = useState();
    const [clientLocation, setClientLocation] = useState(useSelector(state => state.location.userLocation));
    const [clientPhone, setClientPhone] = useState(phoneNumber);

    const [serviceDetails, setServiceDetails] = useState({});
    const [addOrderLoading, setAddOrderLoading] = useState(false);
    const [addOrderError, setAddOrderError] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        if (!phoneNumber && userId) {
            dispatch(profileActions.fetchProfile(userId));
        }
        setClientPhone(phoneNumber);
    }, [phoneNumber, userId]);

    useEffect(() => {
        switch (proId) {
            case "p1":
                setServiceDetails(PlumbingDetails);
                return;
            case "p2":
                setServiceDetails(CleaningDetails);
                return;
            case "p3":
                setServiceDetails(ElectricalDetails);
                return;
            case "p4":
                setServiceDetails(EventsDetails);
                return;
            case "p5":
                setServiceDetails(TaxDetails);
                return;
            case "p6":
                setServiceDetails(BeautyDetails);
                return;
            case "p7":
                setServiceDetails(MovingDetails);
                return;
            case "p8":
                setServiceDetails(ITDetails);
                return;
            case "p9":
                setServiceDetails(PaintingDetails);
                return;
            case "p10":
                setServiceDetails(GardeningDetails);
                return;
            case "p11":
                setServiceDetails(GraphicDesignDetails);
                return;
            case "p12":
                setServiceDetails(TilesDetails);
                return;
            case "p13":
                setServiceDetails(BuilderDetails);
                return;
            case "p14":
                setServiceDetails(WellnessDetails);
                return;
            case "p15":
                setServiceDetails(CookingDetails);
                return;
            case "p16":
                setServiceDetails(CarpentryDetails)
                return;
            case "p17":
                setServiceDetails(PestControlDetails);
                return;
            default:
                return;
        }
    }, [proId]);

    useEffect(() => {
        if (pickedLocationAddress) {
            setClientAddress(pickedLocationAddress);
            setClientLocation(pickedLocation);
        }
        if (selectedItems && type === 'problems') {
            setProblems(selectedItems);
        } else if (selectedItems && type === 'plumbingParts') {
            setPartsthatNeedWork(selectedItems);
        } else if (selectedItems && type === 'rooms') {
            setRoomsThatNeedWork(selectedItems);
        } else if (selectedItems && type === 'buildingType') {
            setBuildingType(selectedItems);
        } else if (selectedItems && type === 'equipmentNeeded') {
            setEquipmentNeeded(selectedItems);
        } else if (selectedItems && type === 'bucketsOfClothes') {
            setBucketsOfClothes(selectedItems);
        } else if (selectedItems && type === 'numberOfPeople') {
            setNumberOfPeople(selectedItems);
        } else if (selectedItems && type === 'serviceNeeded') {
            setServiceNeeded(selectedItems);
        } else if (selectedItems && type === 'proGender') {
            setProGender(selectedItems)
        }
    }, [pickedLocationAddress, selectedItems, type]);

    useEffect(() => {
        const getAddress = async () => {
            try {
                const formattedAddress = await fetchAddress(clientLocation.lat, clientLocation.lng);
                setClientAddress(formattedAddress);
            } catch (err) {
                console.log(err);
            }
        }
        if (clientLocation) {
            getAddress();
        }
    }, []);

    const goToLocation = () => {
        navigation.navigate(
            'Pick Location',
            { userAddress: clientAddress }
        );
    }

    const goToCheckOut = async () => {
        const getString = (stateName) => {
            return Object.keys(stateName).map(key => stateName[key].name).join(", ");
        }
        const orderDetails = {
            problemType: serviceDetails.problemName,
            problemNames: problems ? getString(problems) : null,
            partsThatNeedWork: partsthatNeedWork ? getString(partsthatNeedWork) : null,
            roomsThatNeedWork: roomsThatNeedWork ? getString(roomsThatNeedWork) : null,
            buildingType: buildingType ? getString(buildingType) : null,
            equipmentNeeded: equipmentNeeded ? getString(equipmentNeeded) : null,
            serviceNeeded: serviceNeeded ? getString(serviceNeeded) : null,
            proGender: proGender ? getString(proGender) : null,
            bucketsOfClothes: bucketsOfClothes ? getString(bucketsOfClothes) : null,
            mealDescription: mealDescription ? mealDescription : null,
            numberOfPeople: numberOfPeople ? getString(numberOfPeople) : null,
            optionalInfo,
            clientAddress,
            clientLocation,
            dateRequested: new Date().toISOString(),
            status: "pending"
        }
        if (!clientPhone.trim()) {
            Alert.alert('Wrong Input!', 'Please enter a valid phone number to contact you on.', [{ text: 'Okay' }]);
            return;
        }
        if (!clientLocation || !clientAddress){
            Alert.alert('Location is Required', 'Please input your location so that we can assign a Pro nearest to you. Thank you 😊', [{ text: 'Okay' }]);
            return;
        }
        navigation.navigate('Check Out', {
            orderDetails,
            problemImage,
            clientPhone,
            initiallyHadPhoneNo: phoneNumber ? true : false
        });
    }

    const renderField = (fieldName, stateName) => {
        Object.keys(stateName).forEach(key => {
            fieldName = fieldName + stateName[key].name + ',' + '  ';
        });
        fieldName = fieldName.slice(fieldName).slice(0, fieldName.length - 3);
        return fieldName;
    }

    let renderProblemInfo = '';
    if (problems) {
        renderProblemInfo = renderField(renderProblemInfo, problems);
    }
    let renderPartsthatNeedsWork = '';
    if (partsthatNeedWork) {
        renderPartsthatNeedsWork = renderField(renderPartsthatNeedsWork, partsthatNeedWork);
    }
    let renderRoomsThatNeedWork = '';
    if (roomsThatNeedWork) {
        renderRoomsThatNeedWork = renderField(renderRoomsThatNeedWork, roomsThatNeedWork);
    }
    let renderBuildingType = '';
    if (buildingType) {
        renderBuildingType = renderField(renderBuildingType, buildingType);
    }
    let renderEquipmentNeeded = '';
    if (equipmentNeeded) {
        renderEquipmentNeeded = renderField(renderEquipmentNeeded, equipmentNeeded);
    }
    let renderServiceNeeded = '';
    if (serviceNeeded) {
        renderServiceNeeded = renderField(renderServiceNeeded, serviceNeeded);
    }
    let renderProGender = '';
    if (proGender) {
        renderProGender = renderField(renderProGender, proGender);
    }
    let renderBucketsOfClothes = '';
    if (bucketsOfClothes) {
        renderBucketsOfClothes = renderField(renderBucketsOfClothes, bucketsOfClothes);
    }
    let renderNoOfPeople = '';
    if (numberOfPeople) {
        renderNoOfPeople = renderField(renderNoOfPeople, numberOfPeople);
    }

    if (addOrderLoading) {
        return (
            <View style={styles.container}>
                <Spinner />
            </View>
        );
    }

    if (addOrderError) {
        return (
            <View style={styles.container}>
                <Text style={DefaultStyles.bodyText}>{addOrderError}</Text>
            </View>
        );
    }

    if (Object.keys(serviceDetails).length === 0) {
        return null;
    }

    return (
        <View style={{ padding: 10, backgroundColor: "white", flex: 1, justifyContent: "space-between" }}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={50}  style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.screen}>
                    <Fragment>
                        {
                            serviceDetails.problemField &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>{serviceDetails.problemField.fieldName}</Text>
                                <ListButton
                                    info={renderProblemInfo ? renderProblemInfo : !serviceDetails.problemField.manySelectable ? "Select all that apply" : "Select one"}
                                    pressedHandler={() => {
                                        navigation.navigate('ListItems', {
                                            items: serviceDetails.problemField.items,
                                            type: 'problems',
                                            alreadySelected: problems,
                                            manySelectable: serviceDetails.problemField.manySelectable
                                        })
                                    }}
                                />
                                {/* <View style={styles.errorContainer}><Text style={styles.errorText}>This field is required.</Text></View> */}
                            </Fragment>
                        }
                        {
                            serviceDetails.partThatNeedsWorkField &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>{serviceDetails.partThatNeedsWorkField.fieldName}</Text>
                                <ListButton
                                    info={renderPartsthatNeedsWork ? renderPartsthatNeedsWork : "Select all that apply"}
                                    pressedHandler={() => {
                                        navigation.navigate('ListItems', {
                                            items: serviceDetails.partThatNeedsWorkField.items,
                                            type: 'plumbingParts',
                                            alreadySelected: partsthatNeedWork
                                        })
                                    }}
                                />
                            </Fragment>
                        }
                        {
                            serviceDetails.buildingType &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>{serviceDetails.buildingType.fieldName}</Text>
                                <ListButton
                                    info={renderBuildingType ? renderBuildingType : !serviceDetails.buildingType.manySelectable ? "Select all that apply" : "Select one"}
                                    pressedHandler={() => {
                                        navigation.navigate('ListItems', {
                                            items: serviceDetails.buildingType.items,
                                            type: 'buildingType',
                                            alreadySelected: buildingType,
                                            manySelectable: serviceDetails.buildingType.manySelectable
                                        })
                                    }}
                                />
                            </Fragment>
                        }
                        {
                            serviceDetails.roomThatNeedsWorkField &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>{serviceDetails.roomThatNeedsWorkField.fieldName}</Text>
                                <ListButton
                                    info={renderRoomsThatNeedWork ? renderRoomsThatNeedWork : !serviceDetails.roomThatNeedsWorkField.manySelectable ? "Select all that apply" : "Select one"}
                                    pressedHandler={() => {
                                        navigation.navigate('ListItems', {
                                            items: serviceDetails.roomThatNeedsWorkField.items,
                                            type: 'rooms',
                                            alreadySelected: roomsThatNeedWork,
                                            manySelectable: serviceDetails.roomThatNeedsWorkField.manySelectable
                                        })
                                    }}
                                />
                            </Fragment>
                        }
                        {
                            serviceDetails.bucketsOfClothes &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>{serviceDetails.bucketsOfClothes.fieldName}</Text>
                                <ListButton
                                    info={renderBucketsOfClothes ? renderBucketsOfClothes : !serviceDetails.bucketsOfClothes.manySelectable ? "Select all that apply" : "Select one"}
                                    pressedHandler={() => {
                                        navigation.navigate('ListItems', {
                                            items: serviceDetails.bucketsOfClothes.items,
                                            type: 'bucketsOfClothes',
                                            alreadySelected: bucketsOfClothes,
                                            manySelectable: serviceDetails.bucketsOfClothes.manySelectable
                                        })
                                    }}
                                />
                            </Fragment>
                        }
                        {
                            serviceDetails.mealDescription &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>Describe the meal you would like cooked</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="name of meal, how you want it cooked etc."
                                    multiline={true}
                                    numberOfLines={5}
                                    onChangeText={setMealDescription}
                                    value={mealDescription}
                                />
                            </Fragment>
                        }
                        {
                            serviceDetails.serviceNeeded &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>{serviceDetails.serviceNeeded.fieldName}</Text>
                                <ListButton
                                    info={renderServiceNeeded ? renderServiceNeeded : !serviceDetails.serviceNeeded.manySelectable ? "Select all that apply" : "Select one"}
                                    pressedHandler={() => {
                                        navigation.navigate('ListItems', {
                                            items: serviceDetails.serviceNeeded.items,
                                            type: 'serviceNeeded',
                                            alreadySelected: serviceNeeded,
                                            manySelectable: serviceDetails.serviceNeeded.manySelectable
                                        })
                                    }}
                                />
                            </Fragment>
                        }
                        {
                            serviceDetails.proGender &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>{serviceDetails.proGender.fieldName}</Text>
                                <ListButton
                                    info={renderProGender ? renderProGender : !serviceDetails.proGender.manySelectable ? "Select all that apply" : "Select one"}
                                    pressedHandler={() => {
                                        navigation.navigate('ListItems', {
                                            items: serviceDetails.proGender.items,
                                            type: 'proGender',
                                            alreadySelected: proGender,
                                            manySelectable: serviceDetails.proGender.manySelectable
                                        })
                                    }}
                                />
                            </Fragment>
                        }
                        {
                            serviceDetails.equipmentNeeded &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>{serviceDetails.equipmentNeeded.fieldName}</Text>
                                <ListButton
                                    info={renderEquipmentNeeded ? renderEquipmentNeeded : !serviceDetails.equipmentNeeded.manySelectable ? "Select all that apply" : "Select one"}
                                    pressedHandler={() => {
                                        navigation.navigate('ListItems', {
                                            items: serviceDetails.equipmentNeeded.items,
                                            type: 'equipmentNeeded',
                                            alreadySelected: equipmentNeeded,
                                            manySelectable: serviceDetails.equipmentNeeded.manySelectable
                                        })
                                    }}
                                />
                            </Fragment>
                        }
                        {
                            serviceDetails.numberOfPeople &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>{serviceDetails.numberOfPeople.fieldName}</Text>
                                <ListButton
                                    info={renderNoOfPeople ? renderNoOfPeople : !serviceDetails.numberOfPeople.manySelectable ? "Select all that apply" : "Select one"}
                                    pressedHandler={() => {
                                        navigation.navigate('ListItems', {
                                            items: serviceDetails.numberOfPeople.items,
                                            type: 'numberOfPeople',
                                            alreadySelected: numberOfPeople,
                                            manySelectable: serviceDetails.numberOfPeople.manySelectable
                                        })
                                    }}
                                />
                            </Fragment>
                        }
                        {
                            serviceDetails.optionalInfoField &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>Anything else the pro should be aware of ?</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="optional"
                                    multiline={true}
                                    numberOfLines={5}
                                    onChangeText={setOptionalInfo}
                                    value={optionalInfo}
                                />
                            </Fragment>
                        }
                        {
                            serviceDetails.needsPicture &&
                            <Fragment>
                                <Text style={DefaultStyles.bodyText}>Would you like to add a photo to better desribe your problem ?</Text>
                                <ImagePicker
                                    setImage={setProblemImage}
                                    imageUri={problemImage}
                                />
                            </Fragment>
                        }
                        <Text style={DefaultStyles.bodyText}>Location :</Text>
                        <ListButton info={clientAddress} pressedHandler={goToLocation} />
                        <Fragment>
                            <Text style={DefaultStyles.bodyText}>Phone number to contact you on :</Text>
                            <TextInput
                                style={{ ...styles.input, color: colors.secondary }}
                                placeholder=""
                                onChangeText={(text) => { setClientPhone(text) }}
                                value={clientPhone}
                                keyboardType="number-pad"
                            />
                        </Fragment>
                    </Fragment>
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.buttonContainer}>
                <MainButton
                    style={{ backgroundColor: "red", width: width / 2.3, height: 50 }}
                    onPress={() => {
                        navigation.navigate({ routeName: 'Map' });
                    }}
                >Cancel</MainButton>
                <MainButton
                    style={{ width: width / 2.3, height: 50 }}
                    onPress={() => {
                        goToCheckOut();
                    }}
                >Check Out</MainButton>
            </View>
        </View>

    );
};

ProblemDetailsScreen.navigationOptions = (navigationData) => {
    return {
        title: 'Enter Details',
        headerBackTitle: 'All Services'
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white"
    },
    screen: {
        width: '100%',
        justifyContent: 'center',
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderTopColor: '#ccc',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        fontFamily: 'poppins-regular',
        marginTop: 3,
        marginBottom: 15
    },
    buttonContainer: {
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    errorContainer: {
        marginTop: -10,
        marginBottom: 3
    },
    errorText: {
        fontFamily: 'poppins-regular',
        color: 'red',
        fontSize: 14
    }
})

export default ProblemDetailsScreen;