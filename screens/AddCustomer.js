import React, { useLayoutEffect, useState, useEffect } from 'react'
import { KeyboardAvoidingView, Keyboard, StyleSheet, TextInput, View, Button, Text, TouchableOpacity, Image, Platform, SafeAreaView, TouchableWithoutFeedback } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik';
import { auth, db, dbStorage, dbFieldValue } from '../firebase';
import * as yup from 'yup';
import { useSelector, useDispatch } from "react-redux";

// Create validation rules.
const formSchema = yup.object({
    // Field must be a string and required.
    first_name: yup.string()
        .required('First name is required')
        .min(2, 'At least two characters required.'),
    // last_name: yup.string()
    //     .required('Last name is required')
    //     .min(2, 'At least two characters required.'),
    // email: yup.string().email('Email format invalid.').required('Email is required.'),
    // phone: yup.string().required('Phone is required.'),
})

const AddCustomer = ({ navigation }) => {

    const customer = useSelector((state) => state.customer.value);

    const [currentUserUid, setCurrentUserUid] = useState('');
    const [currentCustomerId, setCurrentCustomerId] = useState('');
    const [customerPhotoArr, setCustomerPhotoArr] = useState([]);
    const [customerPhotoURL, setCustomerPhotoURL] = useState('');


    const placeholderColor = 'gray';

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUserUid(user.uid);
            }
            if (customer.customerData) {
                console.log(`useEffect ~ customer.customerData: `, JSON.stringify(customer.customerData));
                setCurrentCustomerId(customer.customerData.id);
                console.log(`useEffect ~ currentCustomerId`, currentCustomerId);
                if (customer.customerData.customerPhotos) {
                    setCustomerPhotoArr(customer.customerData.customerPhotos);
                    console.log(`useEffect ~ customerPhotoArr`, customerPhotoArr);
                    setCustomerPhotoURL(customerPhotoArr[customerPhotoArr.length - 1])
                    console.log(`@CodeTropolis ~ useEffect ~ customerPhotoURL`, customerPhotoURL);
                }
            }


        });
    }, [currentCustomerId, customerPhotoArr, customerPhotoURL])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Customers",
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        {/* Editing an existing customer so photo should be present. */}
                        {customer.customerData && customerPhotoURL ? (
                            <>
                                <Image
                                    style={styles.customerImage}
                                    // User may retake pic so if theres a value for customer.picFromCam, show it here, else show customerPhotoURL
                                    source={{ uri: customer.picFromCam ? customer.picFromCam.uri : customerPhotoURL }}
                                />
                                <Button title='Retake' color='maroon' onPress={() => navigation.navigate('CustomerIdent')} />
                            </>

                        ) : (
                            // Else no customer data so we must be creating a new customer (Pressing + Customer from Customers page.).
                            <View>
                                {
                                    // Do we have a pic from customerSlice? If so, show it, if not show a button to take the photo.
                                    customer.picFromCam ? (
                                        <View>
                                            <Image
                                                style={styles.customerImage}
                                                source={{ uri: customer.picFromCam.uri }}
                                            />
                                            <Button title='Retake Picture' color='maroon' onPress={() => navigation.navigate('CustomerIdent')} />
                                        </View>
                                    ) : (
                                        <Button title='Take Picture' color='maroon' onPress={() => navigation.navigate('CustomerIdent')} />
                                    )
                                }

                            </View>
                            // Check for image from customerSlice

                        )
                        }



                        <StatusBar style="light" />

                        <Formik
                            // initialValues={{ first_name: '', last_name: '', email: '', phone: '', notes: '' }}
                            initialValues={{ first_name: '' }}
                            validationSchema={formSchema}
                            onSubmit={(values, actions) => {
                                const addOrUpdate = currentCustomerId !== '' ?
                                    db.collection('users').doc(currentUserUid).collection('customers').doc(currentCustomerId).set(values, { merge: true }) :
                                    db.collection('users').doc(currentUserUid).collection('customers').add(values)

                                addOrUpdate.then(async data => {
                                    console.log(`@CodeTropolis ~ AddCustomer ~  addOrUpdate.then data`, data);
                                    const uri = customer.picFromCam.uri;
                                    const path = `${currentUserUid}/${data.id}/${Date.now()}.jpg`;
                                    uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                                    const response = await fetch(uploadUri);
                                    const blob = await response.blob();
                                    dbStorage.ref(path).put(blob)
                                        .then(() => {
                                            //You can check the image is now uploaded in the storage bucket
                                            console.log(`${path} has been successfully uploaded.`);
                                            dbStorage.ref(path).getDownloadURL()
                                                .then(downloadURL => {
                                                    db.collection('users')
                                                        .doc(currentUserUid)
                                                        .collection('customers')
                                                        .doc(data.id)
                                                        .update({ id: data.id, customerPhotos: dbFieldValue.arrayUnion(downloadURL) })
                                                    // .then(() => {
                                                    //     console.log(`@CodeTropolis ~ Photo Saved`);
                                                    // })
                                                })
                                        })

                                })

                                actions.resetForm();
                            }}>
                            {(props) => (
                                <View>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={props.handleChange('first_name')}
                                        value={customer ? customer.first_name : props.values.first_name}
                                        placeholder="First name"
                                        placeholderTextColor={placeholderColor}
                                        onBlur={props.handleBlur('first_name')}
                                    />
                                    {/* Yup attaches errors object to props */}
                                    {props.touched.first_name && props.errors.first_name ? <Text style={styles.error}>{props.errors.first_name}</Text> : null}

                                    {/* <TextInput
                                        style={styles.input}
                                        placeholder='Last name'
                                        placeholderTextColor={placeholderColor}
                                        onChangeText={props.handleChange('last_name')}
                                        value={props.values.last_name}
                                        onBlur={props.handleBlur('last_name')}
                                    />
                                    {props.touched.last_name && props.errors.last_name ? <Text style={styles.error}>{props.errors.last_name}</Text> : null}
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Email'
                                        placeholderTextColor={placeholderColor}
                                        onChangeText={props.handleChange('email')}
                                        value={props.values.email}
                                        onBlur={props.handleBlur('email')}
                                    />
                                    {props.touched.email && props.errors.email ? <Text style={styles.error}>{props.errors.email}</Text> : null}
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Phone'
                                        placeholderTextColor={placeholderColor}
                                        onChangeText={props.handleChange('phone')}
                                        value={props.values.phone}
                                        keyboardType='numeric'
                                        onBlur={props.handleBlur('phone')}
                                    />
                                    {props.touched.phone && props.errors.phone ? <Text style={styles.error}>{props.errors.phone}</Text> : null}
                                    <TextInput
                                        multiline
                                        style={styles.input}
                                        placeholder='Notes...'
                                        placeholderTextColor={placeholderColor}
                                        onChangeText={props.handleChange('notes')}
                                        value={props.values.notes}
                                    /> */}
                                    <Button title='Submit' color='maroon' onPress={props.handleSubmit} />
                                </View>
                            )}
                        </Formik>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default AddCustomer

const styles = StyleSheet.create({

    customerImage: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
        marginBottom: 30,
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    inner: {
        paddingBottom: 100,
        flex: 1,
        justifyContent: "flex-end",
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
