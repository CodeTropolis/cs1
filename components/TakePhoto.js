import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Camera } from 'expo-camera';

const TakePhoto = ({ cameraType, switchCamera, takePhoto }) => {

    const [flashMode, setFlashMode] = useState('off')

    const __handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode('off')
        } else if (flashMode === 'off') {
            setFlashMode('on')
        } else {
            setFlashMode('auto')
        }
    }

    return (

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
                        onPress={switchCamera}
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
                            onPress={takePhoto}
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

    )
}

export default TakePhoto

const styles = StyleSheet.create({})
