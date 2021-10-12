import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Register from './screens/Register';
import Customers from './screens/Customers';
import Login from './screens/Login';
import AddCustomer from './screens/AddCustomer';
import Subscribe from './screens/Subscribe';
import IAP from 'react-native-iap';
import { validateReceipt } from './services/validateReceipt';

// This stack will contain all the pages.
const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: '#4682B4', color: '#fff' },
  headerTitleStyle: { color: 'white' },
  headerTintColor: 'white', // any icons will be white.
}

export default function App() {

  const [checking, setChecking] = useState(true); // ToDo: Change when Checking for products and retrieving products are working.
  const [subscriptionIsExpired, setSubscriptionIsExpired] = useState(true);
  const [hasPurchaseHistory, setHasPurchaseHistory] = useState(true);

  useEffect(() => {
    IAP.initConnection()
      .then(async () => {
        console.log('@CodeTropolis Connected to store.');
        await IAP.getPurchaseHistory()
          .then(async res => {
            if (res) {
              const receipt = res[res.length - 1].transactionReceipt // The most recent receipt.
              // const receipt = res[0].transactionReceipt
              // console.log(`@CodeTropolis ~ .then ~ receipt`, receipt);
              const subscriptionStatus = await validateReceipt(receipt);
              console.log(`@CodeTropolis ~ .then ~ subscriptionStatus`, subscriptionStatus);
              if (subscriptionStatus.isExpired) {
                setSubscriptionIsExpired(true);
                Alert.alert(
                  "Expired",
                  "Your subscription has expired. Please subscribe",
                  [
                    {
                      text: "Ok",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                  ]
                );
              } else {
                setSubscriptionIsExpired(false);
              }
              setChecking(false);

            }
            // else {
            //   setHasPurchaseHistory(false);
            //   setChecking(false);
            // }
          })
          .catch((error) => {
            // !Also get this when subscription is active. But subscriptionStatus is undefined. Had wrong SharedSecret
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
        <Stack.Navigator initialRouteName={subscriptionIsExpired || !hasPurchaseHistory ? 'Subscribe' : 'Customers'} screenOptions={globalScreenOptions}>
          {/* <Stack.Navigator initialRouteName={'Customers'} screenOptions={globalScreenOptions}> */}
          <Stack.Screen name='Register' component={Register} />
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Customers' component={Customers} />
          <Stack.Screen name='AddCustomer' component={AddCustomer} />
          <Stack.Screen name='Subscribe' component={Subscribe} />
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
