import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { Button, Input, Image, Icon } from "react-native-elements"
import { auth } from '../firebase'

const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // useEffect: Per https://reactjs.org/docs/hooks-effect.html 
    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => {
            // console.log(`@CodeTropolis ~ useEffect ~ authUser`, authUser);
            if (authUser) {
                // navigation.replace('Subscribe')
            }
        });
        // useEffect has a cleanup function
        return unsubscribe;
    }, [])

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password).catch(error => alert(error))
    }

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            {/* status bar light = white text for time and status bar icons (signal strength, wifi fan, and battery level) */}
            <StatusBar style="light" />


            {/* <Image style={styles.brandImage}
                source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Signal-Logo.svg/1200px-Signal-Logo.svg.png" }}
            /> */}

            <Icon name="people-alt" size={150} type="Ionicons" />
            <View style={styles.inputContainer}>
                <Input placeholder="Email" autoFocus type="email" value={email} onChangeText={(text) => setEmail(text)} />
                <Input
                    placeholder="Password"
                    secureTextEntry type="password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    onSubmitEditing={signIn}
                />
                <Button style={styles.button} title="Login" onPress={signIn} />
                <Button onPress={() => navigation.navigate('Register')} containerStyle={styles.button} type="outline" title="Register" />
            </View>

            {/* Hack to give extra area upon KeyboardAvoidingView */}
            <View style={{ height: 100 }} />
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    brandImage: {
        marginBottom: 30,
        width: 200,
        height: 200,
    },
    button: {
        marginTop: 10
    },
    inputContainer: { width: '90%' }
})
