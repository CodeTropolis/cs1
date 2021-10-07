// Generated via rnfes snippet.

import React, { useLayoutEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { auth, db } from '../firebase'
import { Button, Input, Text } from "react-native-elements"

const Register = ({ navigation }) => {

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(authUser => {
                const user = authUser.user;
                authUser.user.updateProfile({ displayName })
                    .then(() => {
                        db.collection('users')
                            .doc(user.uid)
                            .set({
                                displayName: user.displayName,
                                email: user.email,
                                uid: user.uid
                            })
                        navigation.replace('Subscribe');
                    })
                    .catch(error => alert(error))
            })
            .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
                <Input placeholder="Screen name (can be anything)" autofocus type='text' value={displayName} onChangeText={(text) => setDisplayName(text)} />
                <Input placeholder="Email" type='email' value={email} onChangeText={(text) => setEmail(text)} />
                <Input placeholder="Password" type='password' secureTextEntry value={password} onChangeText={(text) => setPassword(text)} />
            </View>
            <Button containerStyle={styles.button} raised onPress={register} title="Register" />
            <View style={{ height: 100 }} />
        </KeyboardAvoidingView>
    )
}

export default Register

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
    inputContainer: { width: '90%' }
})
