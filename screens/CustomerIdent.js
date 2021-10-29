import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Camera } from 'expo-camera';
import CameraPreview from '../components/CameraPreview'
import { db } from '../firebase'
import { useDispatch } from 'react-redux';
import { addCustomerImage } from '../features/customerSlice'
// import TakePhoto from '../components/CameraTakePhoto'
let camera

const CustomerIdent = ({ navigation }) => {

    const dispatch = useDispatch()

    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
    const [flashMode, setFlashMode] = useState('off')

    const __startCamera = async () => {
        const { status } = await Camera.requestPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Access denied')
        }
    }
    const __takePicture = async () => {
        if (!camera) return
        // const photo = await camera.takePictureAsync({ base64: false, quality: 0.7 })
        const photo = await camera.takePictureAsync({ base64: false, quality: 0.7, onPictureSaved: __onPictureSaved })
        setPreviewVisible(true)
        // setCapturedImage(photo)
    }
    // Todo: Does't apply size / ratio to saved image in Firebase storage
    const __onPictureSaved = photo => {
        photo.width = 500;
        photo.height = 375;
        setCapturedImage(photo)
    }

    const __usePhoto = () => {
        dispatch(addCustomerImage(capturedImage))
        setPreviewVisible(false)
        navigation.navigate('AddCustomer')
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
            <View
                style={{
                    flex: 1,
                    width: '100%'
                }}
            >
                {previewVisible && capturedImage ? (
                    <CameraPreview photo={capturedImage} usePhoto={__usePhoto} retakePicture={__retakePicture} />
                ) : (
                    // <TakePhoto cameraType={cameraType} flashMode={flashMode} switchCamera={__switchCamera} takePhoto={__takePicture} />
                    <Camera
                        type={cameraType}
                        flashMode={flashMode}
                        ratio='4:3'
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
            <StatusBar style="auto" />
        </View>
    )
}

export default CustomerIdent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
})


