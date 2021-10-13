import React, { useLayoutEffect, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Camera } from 'expo-camera';


const TakePhoto = () => {

    const [startCamera, setStartCamera] = useState(false)

    const __startCamera = async () => {
        const { status } = await Camera.requestPermissionsAsync()
        if (status === 'granted') {
            // start the camera
            setStartCamera(true)
        } else {
            Alert.alert('Access denied')
        }
    }

    return (
        <View style={styles.container}>

            {startCamera ? (
                <Camera
                    style={{ flex: 1, width: "100%" }}
                    ref={(r) => {
                        camera = r
                    }}
                ></Camera>
            ) : (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <TouchableOpacity
                        onPress={__startCamera}
                        style={{
                            width: 130,
                            borderRadius: 4,
                            backgroundColor: '#14274e',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40
                        }}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >
                            Take picture
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default TakePhoto

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
