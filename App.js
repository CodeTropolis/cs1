import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, Alert, TouchableOpacity } from 'react-native';
import {
  connectAsync,
  getProductsAsync,
  setPurchaseListener,
  finishTransactionAsync,
  IAPResponseCode,
  purchaseItemAsync,
} from "expo-in-app-purchases";
import { validateReceipt } from './services/validateReceipt';

export default function App() {

  const items = Platform.select({
    ios: ['yearly_basic', 'monthly_basic'],
    android: ['']
  });

  const [products, setProducts] = useState({});

  useEffect(() => {
    const connectToStore = async () => {
      try {
        await connectAsync();
      } catch (error) {
        console.log(`@CodeTropolis ~ connectToStore ~ error`, error);
      }

      // Need to get history and run validate receipt

      // Set purchase listener
      setPurchaseListener(({ responseCode, results, errorCode }) => {
        // Purchase was successful
        if (responseCode === IAPResponseCode.OK) {
          results.forEach(async purchase => {
            // console.log(`@CodeTropolis ~ setPurchaseListener ~ purchase`, purchase);
            const subscriptionStatus = await validateReceipt(purchase.transactionReceipt)
            console.log(`@CodeTropolis ~ setPurchaseListener ~ subscriptionStatus`, subscriptionStatus);
            if (!purchase.acknowledged) {
              console.log(`Successfully purchased ${purchase.productId}`);
              // Process transaction here and unlock content...



              // Then when you're done
              // finishTransactionAsync(purchase);
            }
          });
        } else if (responseCode === IAPResponseCode.USER_CANCELED) {
          console.log('User canceled the transaction');
        } else if (responseCode === IAPResponseCode.DEFERRED) {
          console.log('User does not have permissions to buy but requested parental approval (iOS only)');
        } else {
          console.warn(`Something went wrong with the purchase. Received errorCode ${errorCode}`);
        }
      });

      // From: https://blog.logrocket.com/implementing-in-app-purchases-in-react-native/
      // Note, calling the getProductsAsync() method is a 
      // prerequisite to buying/subscribing to a product. 
      // Even if you already know the subscription ID beforehand, 
      // you still have to do it. Think of it as a handshake to 
      // Apple/Google’s servers before doing the actual thing.
      const products = await getProductsAsync(items);
      // console.log(`@CodeTropolis ~ connectToStore ~ products.results`, products.results);
      setProducts(products.results);

    }
    connectToStore();

  }, [])

  if (products.length > 0) {
    return (
      <View style={styles.container}>
        {products.map((p, i) => {
          return (
            [
              <TouchableOpacity key={i} onPress={() => purchaseItemAsync(p.productId)} style={styles.button} activeOpacity={.5}>
                <Text style={styles.buttonText} >{p.description} | {p.price}</Text>
              </TouchableOpacity>,
              <View key='spacer' style={{ height: 30 }} />
            ]
          )
        })}
        {/* <Button title='Restore Purchases' onPress={() => restorePurchases()} /> */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
