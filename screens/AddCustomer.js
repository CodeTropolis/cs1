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
        .required('First name is required')
        .min(2, 'At least two characters required.'),
    last_name: yup.string()
        .required('Last name is required')
        .min(2, 'At least two characters required.'),
    email: yup.string().email('Email format invalid.').required('Email is required.'),
    phone: yup.string().required('Phone is required.'),
})

const AddCustomer = ({ navigation }) => {

    const [currentUserUid, setCurrentUserUid] = useState('');
    const placeholderColor = 'gray';

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUserUid(user.uid);
            }
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
                            {props.touched.first_name && props.errors.first_name ? <Text style={styles.error}>{props.errors.first_name}</Text> : null}

                            <TextInput
                                style={styles.input}
                                placeholder='Last name'
                                placeholderTextColor={placeholderColor}
                                onChangeText={props.handleChange('last_name')}
                                value={props.values.last_name} />
                            {props.touched.last_name && props.errors.last_name ? <Text style={styles.error}>{props.errors.last_name}</Text> : null}
                            <TextInput
                                style={styles.input}
                                placeholder='Email'
                                placeholderTextColor={placeholderColor}
                                onChangeText={props.handleChange('email')}
                                value={props.values.email} />
                            {props.touched.email && props.errors.email ? <Text style={styles.error}>{props.errors.email}</Text> : null}
                            <TextInput
                                style={styles.input}
                                placeholder='Phone'
                                placeholderTextColor={placeholderColor}
                                onChangeText={props.handleChange('phone')}
                                value={props.values.phone}
                                keyboardType='numeric'
                            />
                            {props.touched.phone && props.errors.phone ? <Text style={styles.error}>{props.errors.phone}</Text> : null}
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
