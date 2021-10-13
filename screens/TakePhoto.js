import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Camera } from 'expo-camera';
import CameraPreview from '../components/CameraPreview'
let camera

const TakePhoto = () => {

    const [startCamera, setStartCamera] = useState(false)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
    const [flashMode, setFlashMode] = useState('off')



    const __startCamera = async () => {
        const { status } = await Camera.requestPermissionsAsync()
        if (status === 'granted') {
            // start the camera
            setStartCamera(true)
        } else {
            Alert.alert('Access denied')
        }
    }

    const __takePicture = async () => {
        if (!camera) return
        const photo = await camera.takePictureAsync()
        console.log(photo)
        setPreviewVisible(true)
        setCapturedImage(photo)
    }
    const __savePhoto = () => {
        console.log(`@CodeTropolis ~ TakePhoto ~ __savePhoto capturedImage`, capturedImage);
        setPreviewVisible(false)
    }
    const __retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        __startCamera()
    }
    const __handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode('off')
        } else if (flashMode === 'off') {
            setFlashMode('on')
        } else {
            setFlashMode('auto')
        }
    }
    const __switchCamera = () => {
        if (cameraType === 'back') {
            setCameraType('front')
        } else {
            setCameraType('back')
        }
    }

    return (
        <View style={styles.container}>
            {startCamera ? (
                <View
                    style={{
                        flex: 1,
                        width: '100%'
                    }}
                >
                    {previewVisible && capturedImage ? (
                        <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
                    ) : (
                        <Camera
                            type={cameraType}
                            flashMode={flashMode}
                            style={{ flex: 1 }}
                            ref={(r) => {
                                camera = r
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    flexDirection: 'row'
                                }}
                            >
                                <View
                                    style={{
                                        position: 'absolute',
                                        left: '5%',
                                        top: '10%',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={__handleFlashMode}
                                        style={{
                                            backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                                            borderRadius: 50,
                                            height: 25,
                                            width: 25
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 20
                                            }}
                                        >
                                            ⚡️
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={__switchCamera}
                                        style={{
                                            marginTop: 20,
                                            borderRadius: 50,
                                            height: 25,
                                            width: 25
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 20,
                                            }}
                                        >
                                            {cameraType === 'front' ? '🤳' : '📷'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        flexDirection: 'row',
                                        flex: 1,
                                        width: '100%',
                                        padding: 20,
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <View
                                        style={{
                                            alignSelf: 'center',
                                            flex: 1,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={__takePicture}
                                            style={{
                                                width: 70,
                                                height: 70,
                                                bottom: 0,
                                                borderRadius: 50,
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Camera>
                    )}
                </View>
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
                            Take Photo
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <StatusBar style="auto" />
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

