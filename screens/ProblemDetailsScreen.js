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
import { fetchAddress } from '../utility/functions';
import { PlumbingDetails, CleaningDetails } from '../data/problem-details';
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
            default:
                return
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
    }, [clientLocation]);

    const goToLocation = () => {
        navigation.navigate(
            'Pick Location',
            { userAddress: clientAddress }
        );
    }

    const addOrder = async () => {
        setAddOrderError(null);
        setAddOrderLoading(true);
        try {
            const orderDetails = {
                problemType: "plumbing",
                problemNames: [...Object.keys(problems).map(key => problems[key].name)],
                partsThatNeedWork: [...Object.keys(partsthatNeedWork).map(key => partsthatNeedWork[key].name)],
                roomsThatNeedWork: [...Object.keys(roomsThatNeedWork).map(key => roomsThatNeedWork[key].name)],
                optionalInfo,
                clientAddress,
                clientLocation,
                dateRequested: new Date().toString(),
                status: "pending"
            }
            await dispatch(orderActions.addOrder(userId, orderDetails, problemImage));
            setAddOrderLoading(false);
        } catch (err) {
            setAddOrderError(err.message);
            setAddOrderLoading(false);
        }
    }

    let renderProblemInfo = '';
    if (problems) {
        Object.keys(problems).forEach(key => {
            renderProblemInfo = renderProblemInfo + problems[key].name + ',' + '  ';
        });
        renderProblemInfo = renderProblemInfo.slice(renderProblemInfo).slice(0, renderProblemInfo.length - 3);
    }
    let renderPartsthatNeedsWork = '';
    if (partsthatNeedWork) {
        Object.keys(partsthatNeedWork).forEach(key => {
            renderPartsthatNeedsWork = renderPartsthatNeedsWork + partsthatNeedWork[key].name + ',' + '  ';
        })
        renderPartsthatNeedsWork = renderPartsthatNeedsWork.slice(0, renderPartsthatNeedsWork.length - 3);
    }
    let renderRoomsThatNeedWork = '';
    if (roomsThatNeedWork) {
        Object.keys(roomsThatNeedWork).forEach(key => {
            renderRoomsThatNeedWork = renderRoomsThatNeedWork + roomsThatNeedWork[key].name + ',' + '  ';
        })
        renderRoomsThatNeedWork = renderRoomsThatNeedWork.slice(0, renderRoomsThatNeedWork.length - 3);
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

    if (Object.keys(serviceDetails).length === 0){
        return null;
    }

    return (
        <ScrollView contentContainerStyle={styles.screen}>
            <Fragment>
                {
                    serviceDetails.problemField &&
                    <Fragment>
                        <Text style={DefaultStyles.bodyText}>What problem are you having ?</Text>
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
                    serviceDetails.roomThatNeedsWorkField &&
                    <Fragment>
                        <Text style={DefaultStyles.bodyText}>{serviceDetails.roomThatNeedsWorkField.fieldName}</Text>
                        <ListButton
                            info={renderRoomsThatNeedWork ? renderRoomsThatNeedWork : "Select all that apply"}
                            pressedHandler={() => {
                                navigation.navigate('ListItems', {
                                    items: serviceDetails.roomThatNeedsWorkField.items,
                                    type: 'rooms',
                                    alreadySelected: roomsThatNeedWork
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
                            //navigation.navigate({ routeName: 'Check Out' });
                            addOrder();
                        }}
                    >Check Out</MainButton>
                </View>

            </Fragment>
        </ScrollView>
    );
};

ProblemDetailsScreen.navigationOptions = (navigationData) => {
    return {
        title: 'Enter Details'
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
        marginBottom: 7
    },
    buttonContainer: {
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    }
})

export default ProblemDetailsScreen;