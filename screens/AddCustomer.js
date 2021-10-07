import React, { useLayoutEffect, useState, useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View, Button } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import { TextInput } from 'react-native-gesture-handler'
import { auth, db } from '../firebase'

const AddCustomer = ({ navigation }) => {

    const [currentUserUid, setCurrentUserUid] = useState('');

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            db.collection('users');
            setCurrentUserUid(user.uid);
        })
    }, [])


    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Customers",
        });
    }, [navigation])

    return (
        <KeyboardAvoidingView>
            <StatusBar style="light" />
            <View>
                {/* https://youtu.be/t4Q1s8WntlA?t=266 */}
                {/* Formik provides props */}
                <Formik
                    initialValues={{ first_name: '', last_name: '', notes: '' }}
                    onSubmit={(values, actions) => {
                        db.collection('users').doc(currentUserUid).collection('customers').add(values);
                        actions.resetForm();
                    }}>

                    {(props) => (
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder='First name'
                                onChangeText={props.handleChange('first_name')}
                                value={props.values.first_name} />
                            <TextInput
                                style={styles.input}
                                placeholder='Last name'
                                onChangeText={props.handleChange('last_name')}
                                value={props.values.last_name} />
                            <TextInput
                                multiline
                                style={styles.input}
                                placeholder='Notes...'
                                onChangeText={props.handleChange('notes')}
                                value={props.values.notes}
                            // keyboardType='numeric'
                            />
                            <Button title='Submit' color='maroon' onPress={props.handleSubmit} />
                        </View>
                    )}
                </Formik>
            </View>
        </KeyboardAvoidingView>
    )
}

export default AddCustomer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    button: {
        width: 200,
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 18,
        borderRadius: 5,
        marginTop: 7
    }
})
