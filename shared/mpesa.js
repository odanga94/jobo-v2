import { auth as firebaseAuth } from 'firebase';
const moment = require('moment');
const fetch = require('node-fetch');
import { Buffer } from 'buffer';

const getMpesaAccessToken = async () => {
    const consumer_key = "hLgUSAWoGqanoOXG6gHepGGfOk7j4HTG",
        consumer_secret = "UddtguXGnqHQaQB2",
        url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        auth = "Basic " + new Buffer(consumer_key + ":" + consumer_secret).toString("base64");
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": auth
            }
        });
        const jsonResponse = await response.json();
        //console.log('res', jsonResponse);
        return jsonResponse.access_token;
    } catch (err) {
        console.log(err);
        throw new Error("mpesaConfigError");
    }
}
//getMpesaAccessToken();

const getPassword = (shortCode, passKey, timeStamp) => {
    let data = shortCode + passKey + timeStamp;
    let buff = new Buffer(data);
    let base64data = buff.toString('base64');
    //console.log('pass', base64data);
    return base64data;
}

const formatPhone = phoneNumber => {
    return parseInt('254' + phoneNumber.slice(1));
}

const generateLongDesc = word => {
    while (word.length < 1000){
        word = word + word
    }
    console.log(word)
    return word;
}

export const billClient = async (userId, orderId, clientPhone) => {
    //const firebaseToken = await firebaseAuth().currentUser.getIdToken(false) ?auth=${firebaseToken}; 
    //console.log('token', firebaseToken);
    //console.log('uid orderId', userId, orderId);
    const oauth_token = await getMpesaAccessToken(),
        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        auth = "Bearer " + oauth_token;
    const timeStamp = moment().format('YYYYMMDDHHmmss');
    //console.log('time', timeStamp)
    const passKey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const password = getPassword(174379, passKey, timeStamp);
    const phoneNumber = formatPhone(clientPhone);
    const jsonObj = JSON.stringify({
        "BusinessShortCode": 174379,
        "Password": password,
        "Timestamp": timeStamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": 10,
        "PartyA": phoneNumber,
        "PartyB": 174379,
        "PhoneNumber": phoneNumber,
        "CallBackURL": `https://jobo-3a84b.firebaseio.com/payments/${userId}/${orderId}.json`,
        "AccountReference": "Jobo",
        "TransactionDesc": "Jobo",
    });
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": auth,
                "Content-Type": "application/json"
            },
            body: jsonObj
        });
        const jsonResponse = await response.json();
        console.log('res', jsonResponse);
        if(jsonResponse.errorMessage){
            throw new Error(jsonResponse);
        }
    } catch (err) {
        console.log(err);
        throw new Error("mpesaConfigError");
    }
}

//billClient();
