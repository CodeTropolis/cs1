import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, Alert, TouchableOpacity } from 'react-native';
import IAP from 'react-native-iap';
import { validateReceipt } from './services/validateReceipt';

export default function App() {

  const items = Platform.select({
    ios: ['yearly_basic', 'monthly_basic'],
    android: ['']
  });

  const [products, setProducts] = useState({});

  useEffect(() => {

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
