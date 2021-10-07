// Issue with scripts lint in functions->package.json that throws error upon deploying.
// Fix: https://stackoverflow.com/a/65755871

const functions = require("firebase-functions");
const axios = require('axios');

exports.validateIOS = functions.https.onCall(async (d) => {
    // These properties from: https://developer.apple.com/documentation/appstorereceipts/requestbody
    const data = JSON.stringify({
        'receipt-data': d['receipt-data'], //receipt-data (sending from app in receiptBody object). attempting d.receipt-data will result in spaces at dash.
        'password': d['password'],
        // password: '3ad7c85c5604476eb550974f1cd65fff',
        'exclude-old-transactions': true,
    })
    // ToDo: Change verifyReceipt endpoint for PROD.
    // ToDo: See: https://developer.apple.com/documentation/storekit/original_api_for_in-app_purchase/validating_receipts_with_the_app_store
    const result = await axios.post('https://sandbox.itunes.apple.com/verifyReceipt', data);
    const receiptData = result['data']['latest_receipt_info'][0];
    console.log(`@CodeTropolis ~ receiptData`, receiptData);
    const currentProductId = receiptData.product_id;
    const expiry = receiptData.expires_date_ms;
    const expired = Date.now() > expiry;

    return {
        isExpired: expired,
        currentProductId,
    }
})