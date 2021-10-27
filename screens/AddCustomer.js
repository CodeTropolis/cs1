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

    const [savedValues, setSavedValues] = useState(null);

    const initialValues = {
        first_name: '',
    }

    const placeholderColor = 'gray';

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUserUid(user.uid);
            }
            if (customer.customerData) {
                setCurrentCustomerId(customer.customerData.id);
                setCustomerPhotoArr(customer.customerData.customerPhotos);
                setCustomerPhotoURL(customerPhotoArr[customerPhotoArr.length - 1]);
                setSavedValues({
                    first_name: customer.customerData.first_name,
                })
            }


        });
    }, [currentCustomerId, customerPhotoArr])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Customers",
        });
    }, [navigation]);


    const updateCustomer = (values) => {
        return db.collection('users').doc(currentUserUid).collection('customers').doc(currentCustomerId).set(values, { merge: true })
            .then(() => {
                return currentCustomerId;
            })
    }

    const saveNewCustomer = (values) => {
        return db.collection('users').doc(currentUserUid).collection('customers')
            .add(values)
            .then(async (returnData) => {
                db.doc(returnData.path).update({ id: returnData.id })
                return returnData.id
            });
    }

    const savePhoto = async (customerId) => {
        const uri = customer.picFromCam.uri;
        const path = `${currentUserUid}/${customerId}/${Date.now()}.jpg`;
        uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const response = await fetch(uploadUri);
        const blob = await response.blob();
        return await dbStorage.ref(path).put(blob)
            .then(() => {
                // You can check the image is now uploaded in the storage bucket
                // Add the download URL to the customerPhotos array on the customer doc
                dbStorage.ref(path).getDownloadURL()
                    .then(downloadURL => {
                        db.collection('users')
                            .doc(currentUserUid)
                            .collection('customers')
                            .doc(customerId)
                            .update({ customerPhotos: dbFieldValue.arrayUnion(downloadURL) })
                    })
            })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        {/* Editing an existing customer so photo should be present from customer data. */}
                        {customer.customerData && customerPhotoURL ? (
                            <>
                                {/* In JSX boolean value will not render. */}
                                <Image
                                    style={styles.customerImage}
                                    // User may retake pic. If so, show the value for customer.picFromCam, else show customerPhotoURL
                                    source={customer.picFromCam ? { uri: customer.picFromCam.uri } : { uri: customerPhotoURL }}
                                />
                                <Button title='Retake' color='maroon' onPress={() => navigation.navigate('CustomerIdent')} />
                            </>

                        ) : (
                            // Else no customer data so we must be creating a new customer.
                            <>
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

                            </>

                        )
                        }
                        <StatusBar style="light" />
                        <Formik
                            // initialValues={{ first_name: '', last_name: '', email: '', phone: '', notes: '' }}
                            initialValues={savedValues || initialValues}
                            validationSchema={formSchema}
                            onSubmit={(values, actions) => {
                                const updateOrSave = currentCustomerId !== '' ? updateCustomer(values) : saveNewCustomer(values);
                                updateOrSave.then(customerId => {
                                    if (customer.picFromCam && customer.picFromCam.uri) { // Only save if we have a pic from the cam.
                                        savePhoto(customerId)
                                    }
                                })
                                actions.resetForm();
                            }}
                            enableReinitialize
                        >
                            {(props) => (
                                <View>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={props.handleChange('first_name')}
                                        defaultValue={customer && customer.customerData ? customer.customerData.first_name : null}
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
                                    <Button disabled={!props.isValid} title='Submit' color='maroon' onPress={props.handleSubmit} />
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
