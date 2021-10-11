import React, { useLayoutEffect, useState, useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, TextInput, View, Button, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik';
import { auth, db } from '../firebase';
import * as yup from 'yup';

// Create validation rules.
const formSchema = yup.object({
    // Field must be a string and required.
    first_name: yup.string()
        .required('First name is required and must contain at least 2 characters')
        .min(2)
        .typeError('First name is required and must contain at least 2 characters'),
    last_name: yup.string().required().min(2),
    email: yup.string().email('Email format invalid.').required(), // get email regex?
    phone: yup.number().required(), // use number()?
})

const AddCustomer = ({ navigation }) => {

    const [currentUserUid, setCurrentUserUid] = useState('');
    const placeholderColor = 'gray';

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
            <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <Formik
                    initialValues={{ first_name: '', last_name: '', email: '', phone: '', notes: '' }}
                    validationSchema={formSchema}
                    onSubmit={(values, actions) => {
                        db.collection('users').doc(currentUserUid).collection('customers').add(values);
                        actions.resetForm();
                    }}>
                    {(props) => (
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={props.handleChange('first_name')}
                                value={props.values.first_name}
                                placeholder="First name"
                                placeholderTextColor={placeholderColor}
                            />
                            {/* Yup attaches errors object to props */}
                            {props.errors.first_name ? <Text style={styles.error}>{props.errors.first_name}</Text> : null}

                            <TextInput
                                style={styles.input}
                                placeholder='Last name'
                                placeholderTextColor={placeholderColor}
                                onChangeText={props.handleChange('last_name')}
                                value={props.values.last_name} />
                            <TextInput
                                style={styles.input}
                                placeholder='Email'
                                placeholderTextColor={placeholderColor}
                                onChangeText={props.handleChange('email')}
                                value={props.values.email} />
                            <TextInput
                                style={styles.input}
                                placeholder='Phone'
                                placeholderTextColor={placeholderColor}
                                onChangeText={props.handleChange('phone')}
                                value={props.values.phone}
                                keyboardType='numeric'
                            />
                            <TextInput
                                multiline
                                style={styles.input}
                                placeholder='Notes...'
                                placeholderTextColor={placeholderColor}
                                onChangeText={props.handleChange('notes')}
                                value={props.values.notes}
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
        borderColor: 'lightsteelblue',
        padding: 10,
        fontSize: 18,
        borderRadius: 5,
        marginTop: 16,
        minWidth: '90%'
    },
    error: {
        color: 'maroon'
    }
})
