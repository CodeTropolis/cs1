import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, Alert, TouchableOpacity } from 'react-native';
import IAP from 'react-native-iap';
import { validateReceipt } from '../services/validateReceipt';

const Subscribe = ({ navigation }) => {

    const items = Platform.select({
        ios: ['cs1_monthly'],
        android: ['']
    });

    const [products, setProducts] = useState({});
    const [isPurchasing, setIsPurchasing] = useState(false);

    useEffect(() => {
        IAP.getSubscriptions(items)
            .then((res) => {
                setProducts(res);
            })
            .catch((error) => console.log(`@CodeTropolis ~ error getting subscriptions: `, JSON.stringify(error)))

        const purchaseErrorSubscription = IAP.purchaseErrorListener(error => {
            if (error.responseCode === '2') {
                // user cancelled
                Alert.alert("User cancelled purchase. Error: ", JSON.stringify(error));
            } else {
                Alert.alert("There has been an error with your purchase. Error: ", JSON.stringify(error));
            }
        });

        const purchaseUpdateSubscription = IAP.purchaseUpdatedListener(async purchase => {
            try {
                const receipt = purchase.transactionReceipt;
                //https://youtu.be/4JLHRV2kiCU?list=PLekF6r71R4TEaq__BaXfvmBcHvnWPahY-&t=3409f
                if (receipt) {
                    const subscriptionStatus = await validateReceipt(receipt);
                    if (!subscriptionStatus.isExpired) {
                        IAP.finishTransaction(purchase);
                        navigation.replace('Customers');
                    }
                    // setIsPurchasing(false); //!Can't perform a React state update on an unmounted component
                }
            } catch (error) {
                console.log(`@CodeTropolis ~ useEffect ~ purchaseUpdatedListener error`, error);
            }
        })
        return () => {
            //https://github.com/dooboolab/react-native-iap/issues/926#issuecomment-678140114
            purchaseUpdateSubscription.remove();
            purchaseErrorSubscription.remove();
        };
    }, []);

    // restorePurchases()
    // Use IAP.getAvailablePurchases() to get a receipt and send to the validate() method.
    // From https://github.com/dooboolab/react-native-iap/blob/master/IapExample/App.js
    // ToDo: Upgrades and downgrades?
    const restorePurchases = async () => {
        try {
            console.info(
                'Get available purchases (non-consumable or unconsumed consumable)',
            );
            const purchases = await IAP.getAvailablePurchases();
            if (purchases && purchases.length > 0) {
                const purchase = purchases[0];
                const receipt = purchase.transactionReceipt;
                if (receipt) {
                    const subscriptionStatus = await validateReceipt(receipt);
                    if (!subscriptionStatus.isExpired) {
                        navigation.replace('Customers');
                    } else {
                        Alert.alert("Subscription expired. Please subscribe.");
                    }
                }
            }
        } catch (err) {
            console.warn(err.code, err.message);
            Alert.alert(err.message);
        }
    }

    const makePurchase = async (productId) => {
        setIsPurchasing(true);
        IAP.requestSubscription(productId);
    }

    if (isPurchasing) {
        return (
            <View style={styles.container}>
                <Text>Making Purchase...</Text>
                <StatusBar style="auto" />
            </View>
        );
    }

    if (products.length > 0) {
        return (
            <View style={styles.container}>
                {products.map((p, i) => {
                    return (
                        [
                            <TouchableOpacity key={i} onPress={() => makePurchase(p.productId)} style={styles.button} activeOpacity={.5}>
                                <Text style={styles.buttonText} >{p.description} | {p.localizedPrice} </Text>
                            </TouchableOpacity>,
                            <View key='spacer' style={{ height: 30 }} />
                        ]
                    )
                })}
                <Button title='Restore Purchases' onPress={() => restorePurchases()} />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text>Loading products...</Text>
                <StatusBar style="auto" />
            </View>
        );
    }

}

export default Subscribe

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'maroon',
        width: 300,
        padding: 12,
        borderRadius: 7,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    }
});

