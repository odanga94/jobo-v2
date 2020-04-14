import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Dimensions } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector } from 'react-redux';
import * as firebase from 'firebase';
import moment from 'moment';

import { IoniconHeaderButton } from '../components/UI/HeaderButton';
import MainButton from '../components/UI/MainButton';
import SupportForm from '../components/SupportForm';
import DefaultStyles from '../constants/default-styles';
import Spinner from '../components/UI/Spinner';
import Card from '../components/UI/Card';
import Colors from '../constants/colors';

const getReadableDate = (date) => {
    return moment(date).format('MMM Do');
}

const getTime = (date) => {
    return moment(date).format('h:mm a')
}

const formatToSentenceCase = text => text.split("")[0].toUpperCase() + text.slice(1);

const { height } = Dimensions.get('window')

const SupportScreen = props => {
    const userId = useSelector(state => state.auth.userId);

    const [formVisible, setFormVisible] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [fetchTicketsLoading, setFetchTicketsLoading] = useState(true);
    const [fetchTicketsErr, setFetchTicketsErr] = useState();

    const fetchTickets = useCallback(async () => {
        setFetchTicketsErr();
        if (userId) {
            //setFetchTicketsLoading(true);
            try {
                const dataSnapshot = await firebase.database().ref(`support_tickets/${userId}`).once('value');
                const resData = dataSnapshot.val();
                const loadedTickets = resData ? Object.keys(resData).map(key => {
                    return {
                        ticketId: key,
                        ...resData[key]
                    }
                }) : [];
                loadedTickets.sort((a, b) => a.dateCreated > b.dateCreated ? -1 : 1)
                setTickets(loadedTickets);
                setFetchTicketsLoading(false);
                return;
            } catch (err) {
                Alert.alert('An error occurred!', err.message, [{ text: 'Okay' }]);
                setFetchTicketsErr('Something went wrong 😞. Try again later')
                setFetchTicketsLoading(false);
                return;
            }
        }
        setFetchTicketsErr('Something went wrong 😞. Try again later')
        setFetchTicketsLoading(false);
    }, [userId]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const toggleFormVisible = useCallback(() => {
        setFormVisible(true);
    }, []);

    useEffect(() => {
        props.navigation.setParams({ 'showForm': toggleFormVisible })
    }, [toggleFormVisible]);

    const addTicket = async (category, subject, description) => {
        try {
            const date = new Date().toISOString();
            const ticketDetails = {
                category,
                subject,
                description,
                dateCreated: date,
                status: "pending"
            }
            const ticketRef = await firebase.database().ref(`support_tickets/${userId}`).push(ticketDetails);
            const ticketRefArray = ticketRef.toString().split('/');
            const ticketId = ticketRefArray[ticketRefArray.length - 1];
            setTickets(currTickets => currTickets.concat({ ...ticketDetails, ticketId: ticketId }).sort((a, b) => a.dateCreated > b.dateCreated ? -1 : 1));
        } catch (err) {
            throw new Error(err);
        }
    }

    const renderItem = ({ item }) => {
        /* let noOfReplies = 0
        let titleText = 'REPLIES';
        if (item.replies){
            noOfReplies = Object.keys(item.replies).length;
            if (noOfReplies === 1){
                titleText = 'REPLY'
            }
        } */
        return (
            <Card style={styles.card}>
                <View style={styles.summary}>
                    <Text style={DefaultStyles.titleText}>{item.category}</Text>
                    <Text style={{ ...DefaultStyles.bodyText, color: "#505050" }}>{getReadableDate(item.dateCreated)}, {getTime(item.dateCreated)}</Text>
                </View>
                <View style={{ height: "60%" }}>
                    <Text style={{ ...DefaultStyles.titleText, color: "#505050" }}>{formatToSentenceCase(item.subject)}</Text>
                    <Text style={{ ...DefaultStyles.bodyText, height: "60%" }}>{formatToSentenceCase(item.description)}</Text>
                </View>
                <View style={{ height: "20%", flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={DefaultStyles.bodyText}>status: <Text style={{ ...DefaultStyles.titleText, color: Colors.secondary }}>{formatToSentenceCase(item.status)}</Text></Text>
                    <Text style={DefaultStyles.bodyText}>replies: <Text style={{ ...DefaultStyles.titleText, color: Colors.secondary }}>{0}</Text></Text>
                </View>

                {/* <Text style={DefaultStyles.bodyText}>: <Text style={{...DefaultStyles.titleText, color: Colors.secondary}}>{formatToSentenceCase(item.status)}</Text></Text> */}
                {/* <MainButton>View Details</MainButton> */}

            </Card>
        )
    }

    if (fetchTicketsErr) {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", flex: 1, paddingHorizontal: 20 }}>
                <Text style={{...DefaultStyles.titleText, textAlign: "center" }}>{fetchTicketsErr}</Text>
                <MainButton onPress={fetchTickets} style={{ marginTop: 10 }}>
                    Try Again
                </MainButton>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 10 }}>
            <SupportForm
                formVisible={formVisible}
                pressed={() => setFormVisible(false)}
                addTicket={addTicket}
            />
            {
                fetchTicketsLoading ? <Spinner /> :
                    tickets.length === 0 ?
                        <Fragment>
                            <Text style={{ ...DefaultStyles.titleText, textAlign: "center" }}>You haven't raised any issues yet.</Text>
                            <MainButton
                                style={{ marginTop: 10 }}
                                onPress={() => setFormVisible(true)}
                            >Add Support Ticket</MainButton>
                        </Fragment> :
                        <FlatList
                            data={tickets}
                            keyExtractor={item => item.ticketId}
                            renderItem={renderItem}
                            refreshing={fetchTicketsLoading}
                            onRefresh={fetchTickets}
                        //contentContainerStyle={{ padding: 15, alignItems: "center" }}
                        />
            }

        </View>
    );
};

SupportScreen.navigationOptions = navData => {
    const showForm = navData.navigation.getParam('showForm');
    return {
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconHeaderButton} >
                <Item
                    title='Add Ticket'
                    iconName='ios-add'
                    onPress={() => {
                        showForm();
                    }}
                />
            </HeaderButtons>
        ),
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        maxHeight: height / 4,
        marginTop: 20,
        alignSelf: "center",
        padding: 10,
        width: "95%"
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        height: "20%"
    },
})

export default SupportScreen;