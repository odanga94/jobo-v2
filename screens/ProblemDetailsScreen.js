import React, { useState, useEffect, Fragment } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Dimensions
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
    CarpenterDetails
} from '../data/problem-details';
import * as orderActions from '../store/actions/orders';


const { width } = Dimensions.get('window');

const ProblemDetailsScreen = props => {
    const { navigation } = props;
    const userId = useSelector(state => state.auth.userId);

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
    const [bucketsOfClothes, setBucketsOfClothes] = useState();
    const [mealDescription, setMealDescription] = useState();
    const [numberOfPeople, setNumberOfPeople] = useState();
    const [clientAddress, setClientAddress] = useState('');
    const [optionalInfo, setOptionalInfo] = useState('');
    const [problemImage, setProblemImage] = useState();
    const [clientLocation, setClientLocation] = useState(useSelector(state => state.location.userLocation));

    const [serviceDetails, setServiceDetails] = useState({});
    const [addOrderLoading, setAddOrderLoading] = useState(false);
    const [addOrderError, setAddOrderError] = useState();

    const dispatch = useDispatch();

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
            case "p8":
                setServiceDetails(PaintingDetails);
                return;
            case "p4":
                setServiceDetails(BeautyDetails);
                return;
            case "p5":
                setServiceDetails(MovingDetails);
                return;
            case "p11":
                setServiceDetails(ITDetails);
                return;
            case "p12":
                setServiceDetails(PestControlDetails);
                return;
            case "p6":
                setServiceDetails(GardeningDetails);
                return;
            case "p7":
                setServiceDetails(CookingDetails);
                return;
            case "p10":
                setServiceDetails(TaxDetails);
                return;
            case "p9":
                setServiceDetails(CarpenterDetails);
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
            bucketsOfClothes: bucketsOfClothes ? getString(bucketsOfClothes) : null,
            mealDescription: mealDescription ? mealDescription : null,
            numberOfPeople: numberOfPeople ? getString(numberOfPeople) : null,
            optionalInfo,
            clientAddress,
            clientLocation,
            dateRequested: new Date().toISOString(),
            status: "pending"
        }
        navigation.navigate('Check Out', {
            orderDetails,
            problemImage
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
        <ScrollView contentContainerStyle={styles.screen}>
            <Fragment>
                {
                    serviceDetails.problemField &&
                    <Fragment>
                        <Text style={DefaultStyles.bodyText}>{serviceDetails.problemField.fieldName}</Text>
                        <ListButton
                            info={renderProblemInfo ? renderProblemInfo : "Select all that apply"}
                            pressedHandler={() => {
                                navigation.navigate('ListItems', {
                                    items: serviceDetails.problemField.items,
                                    type: 'problems',
                                    alreadySelected: problems
                                })
                            }}
                        />
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
                <Text style={DefaultStyles.bodyText}>Location:</Text>
                <ListButton info={clientAddress} pressedHandler={goToLocation} />
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

            </Fragment>
        </ScrollView>
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
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center'
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
    }
})

export default ProblemDetailsScreen;