import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Register from './screens/Register';
import Customers from './screens/Customers';
import Login from './screens/Login';
import AddCustomer from './screens/AddCustomer';
import Subscribe from './screens/Subscribe';
import TakePhoto from './screens/TakePhoto';
import IAP from 'react-native-iap';
import { validateReceipt } from './services/validateReceipt';
import * as RootNavigation from './services/rootNavigation';

// This stack will contain all the pages.
const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: '#4682B4', color: '#fff' },
  headerTitleStyle: { color: 'white' },
  headerTintColor: 'white', // any icons will be white.
}

export default function App() {

  const [checking, setChecking] = useState(true);
  const [subscriptionIsExpired, setSubscriptionIsExpired] = useState(true);

  useEffect(() => {
    IAP.initConnection()
      .then(async () => {
        console.log('@CodeTropolis Connected to store.');
        await IAP.getPurchaseHistory()
          .then(async res => {
            if (res) {
              const receipt = res[res.length - 1].transactionReceipt // The most recent receipt.
              const subscriptionStatus = await validateReceipt(receipt);
              if (subscriptionStatus.isExpired) {
                setSubscriptionIsExpired(true);
                Alert.alert(
                  "Subscription Expired",
                  "Please subscribe.",
                  [
                    {
                      text: "Ok",
                      // https://stackoverflow.com/a/61355164
                      onPress: () => RootNavigation.navigate('Subscribe ', null),
                      style: "cancel"
                    },
                  ]
                );
              } else {
                setSubscriptionIsExpired(false);
              }
              setChecking(false);

            }
          })
          .catch((error) => {
            console.log(`@CodeTropolis ~ .then ~ error getting purchase history`, JSON.stringify(error));
            // ToDo: This error occurs on new device. Is this the best way to handle?
            // Might be new device if no results.
            setSubscriptionIsExpired(true);
            setChecking(false);
          })

      })
      .catch(() => {
        console.log('@CodeTropolis Error connecting to store.');
      });
  }, []);


  if (checking) {
    return (
      <View style={styles.container}>
        <Text>Checking for purchases...</Text>
      </View>
    )
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={subscriptionIsExpired ? 'Subscribe' : 'Customers'} screenOptions={globalScreenOptions}>
          <Stack.Screen name='Register' component={Register} />
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Customers' component={Customers} />
          <Stack.Screen name='AddCustomer' component={AddCustomer} />
          <Stack.Screen name='Subscribe' component={Subscribe} />
          <Stack.Screen name='TakePhoto' component={TakePhoto} />
        </Stack.Navigator>
      </NavigationContainer>
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
