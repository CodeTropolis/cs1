import React, { useState, useLayoutEffect, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'
import CustomerListItem from '../components/CustomerListItem'
import { Button, Input, Image, Icon } from "react-native-elements"
import { AntDesign } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth, db } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { editCustomer } from '../features/customerSlice'

const Customers = ({ navigation }) => {

    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer.value);


    const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const authSubscriber = auth.onAuthStateChanged(user => {
            if (!user) {
                navigation.navigate('Login')
            }
            const snapshotSubscriber = db.collection('users')
                .doc(user.uid)
                .collection('customers')
                .onSnapshot(documentSnapshot => {
                    let customers = [];
                    documentSnapshot.docs.forEach(doc => {
                        customers.push(doc.data())
                    })
                    setCustomers(customers);
                    setIsLoadingCustomers(false)
                })

        })
        // Stop listening for updates when no longer required
        return () => {
            authSubscriber();
            // authSubscriber.snapshotSubscriber();
        }
    }, [])


    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={addCustomer} >
                        <View style={styles.iconWithText}>
                            {/* https://stackoverflow.com/a/55185782 */}
                            <AntDesign name="pluscircle" size={32} color="white" />
                            <Text style={{ marginLeft: 10, color: 'white' }}>Customer</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        })
    }, [])

    const addCustomer = () => {
        // Note: navigation.replace will cause back button to not appear
        navigation.navigate('AddCustomer')
    }

    if (!isLoadingCustomers) {
        if (customers.length > 0) {
            return (
                <SafeAreaView>
                    <ScrollView>
                        {customers.map((customer, i) => {
                            return (
                                [
                                    <CustomerListItem key={i} data={customer} onPress={() => dispatch(editCustomer(customer))} />,
                                ]
                            )
                        })}
                    </ScrollView>
                </SafeAreaView>
            )
        } else {
            return (

                <View>
                    <Text>No Customers</Text>
                </View>
            )
        }
    } else {
        return (
            <View><Text>Loading customers...</Text></View>
        )
    }

}

export default Customers

const styles = StyleSheet.create({
    iconWithText: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    }
})
