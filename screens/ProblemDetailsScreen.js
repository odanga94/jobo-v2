import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import MainButton from '../components/UI/MainButton';
import ProDetails from '../components/ProDetails';
import Plumbing from '../components/ProblemDetails/Plumbing';
import ListButton from '../components/UI/ListButton';
import ImagePicker from '../components/ImagePicker';

import DefaultStyles from '../constants/default-styles';
import { fetchAddress } from '../utility/functions';
import { PROS, PRO_DETAILS } from '../data/pros';
import * as orderActions from '../store/actions/orders';
import Spinner from '../components/UI/Spinner';

const ProblemDetailsScreen = props => {
    const { navigation } = props;
    const userId = useSelector(state => state.auth.userId);

    const proId = navigation.getParam('proId');
    const requiredDetails = PRO_DETAILS.find(detail => detail.proIds.indexOf(proId) >= 0);
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

    const [addOrderLoading, setAddOrderLoading] = useState(false);
    const [addOrderError, setAddOrderError] = useState();

    const dispatch = useDispatch();

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

    return (
        <ScrollView contentContainerStyle={styles.screen}>
            <Fragment>
                <Text style={DefaultStyles.bodyText}>What problem are you having ?</Text>
                <ListButton
                    info={renderProblemInfo ? renderProblemInfo : "Select all that apply"}
                    pressedHandler={() => {
                        navigation.navigate('ListItems', {
                            items: ['Installation Work', 'Burst', 'Leak', 'Clog', 'Noisy', 'Unpleasant odor', 'Poor pressure', 'Poor temperature', 'Fixture not draining or flushing', 'Appliance not working', 'Others'],
                            type: 'problems',
                            alreadySelected: problems
                        })
                    }}
                />
                <Text style={DefaultStyles.bodyText}>What part of the plumbing system needs work ?</Text>
                <ListButton
                    info={renderPartsthatNeedsWork ? renderPartsthatNeedsWork : "Select all that apply"}
                    pressedHandler={() => {
                        navigation.navigate('ListItems', {
                            items: ['Pipes and drains', 'Toilet', 'Sink', 'Shower or bathtub', 'Washing machine', 'Water heater', 'Septic tank', 'Well system', 'Others'],
                            type: 'plumbingParts',
                            alreadySelected: partsthatNeedWork
                        })
                    }}
                />
                <Text style={DefaultStyles.bodyText}>Which room requires plumbing work ?</Text>
                <ListButton
                    info={renderRoomsThatNeedWork ? renderRoomsThatNeedWork : "Select all that apply"}
                    pressedHandler={() => {
                        navigation.navigate('ListItems', {
                            items: ['Bathroom', 'Kitchen', 'Laundry room', 'Outdoors', 'Toilet', 'Entire building', 'Others'],
                            type: 'rooms',
                            alreadySelected: roomsThatNeedWork
                        })
                    }}
                />
                <Text style={DefaultStyles.bodyText}>Anything else the pro should be aware of ?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="optional"
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={setOptionalInfo}
                    value={optionalInfo}
                />
                <Text style={DefaultStyles.bodyText}>Would you like to add a photo to better desribe your problem ?</Text>
                <ImagePicker
                    setImage={setProblemImage}
                    imageUri={problemImage}
                />
                <Text style={DefaultStyles.bodyText}>Location:</Text>
                <ListButton info={clientAddress} pressedHandler={goToLocation} />
                {/* <ProDetails
                            estimateDuration={requiredDetails.estimateDuration}
                            needsTools={requiredDetails.needsTools}
                            needsPicture={requiredDetails.needsPicture}
                            needsDimensions={requiredDetails.needsDimensions}
                            /> */}
                <MainButton
                    style={{ marginVertical: 10 }}
                    onPress={() => {
                        //navigation.navigate({ routeName: 'Check Out' });
                        addOrder();
                    }}
                >Check Out</MainButton>
            </Fragment>
        </ScrollView>
    );
};

ProblemDetailsScreen.navigationOptions = (navigationData) => {
    const proId = navigationData.navigation.getParam('proId');
    const selectedPro = PROS.find(pro => pro.id === proId)

    return {
        title: selectedPro.title
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
})

export default ProblemDetailsScreen;