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
        //console.log(jsonResponse);
        return jsonResponse.access_token;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

const getPassword = (shortCode, passKey, timeStamp) => {
    let data = shortCode + passKey + timeStamp;
    let buff = new Buffer(data);
    let base64data = buff.toString('base64');
    //console.log(base64data);
    return base64data;
}

export const billClient = async (userId, orderId) => {
    const oauth_token = await getMpesaAccessToken(),
        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        auth = "Bearer " + oauth_token;
    const timeStamp = moment().format('YYYYMMDDHHmmss');
    const passKey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const password = getPassword(174379, passKey, timeStamp);
    const jsonObj = JSON.stringify({
        "BusinessShortCode": 174379,
        "Password": password,
        "Timestamp": timeStamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": 10,
        "PartyA": 254799848807,
        "PartyB": 174379,
        "PhoneNumber": 254799848807,
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
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

//billClient();
