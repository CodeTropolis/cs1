export const validateReceipt = (receipt) => {

    const receiptBody = {
        'receipt-data': receipt,
        'password': '7b4160253077497181ed7f9567162791'
    }

    // Backend validation:
    return fetch('https://us-central1-react-native-8bfa7.cloudfunctions.net/validateIOS',
        {
            headers: { 'Content-Type': 'application/json' }, method: 'POST',
            body: JSON.stringify({ data: receiptBody })
        }
    )
        .then(res => {
            return res.json()
                .then(r => {
                    return r.result;
                })
                .catch(error => {
                    console.log(`@CodeTropolis ~ validate ~ res.json error: `, error);
                    return ('Validate error: ', error);
                })
        })
        .catch(error => {
            console.log(`@CodeTropolis ~ validate fetch error: `, error);
            return ('Validate fetch error:', error);
        })
}