import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, Alert, TouchableOpacity } from 'react-native';
import {
  connectAsync,
  getProductsAsync,
  setPurchaseListener,
  finishTransactionAsync,
  IAPResponseCode,
} from "expo-in-app-purchases";

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

      setPurchaseListener(async ({ responseCode, results, errorCode }) => {
        if (responseCode === IAPResponseCode.OK) {
          console.log(`@CodeTropolis ~ setPurchaseListener ~ results`, results);
        }
      })

      // From: https://blog.logrocket.com/implementing-in-app-purchases-in-react-native/
      // Note, calling the getProductsAsync() method is a 
      // prerequisite to buying/subscribing to a product. 
      // Even if you already know the subscription ID beforehand, 
      // you still have to do it. Think of it as a handshake to 
      // Apple/Google’s servers before doing the actual thing.
      const products = await getProductsAsync(items);
      console.log(`@CodeTropolis ~ connectToStore ~ products`, products.results);
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
              <TouchableOpacity key={i} onPress={() => IAP.requestSubscription(p.productId)} style={styles.button} activeOpacity={.5}>
                <Text style={styles.buttonText} >{p.description} | {p.price} </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
