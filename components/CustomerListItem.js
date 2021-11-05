import React, { useState } from 'react'
import { StyleSheet, Text, Image, View, ActivityIndicator } from 'react-native'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { Icon } from "react-native-elements"
import * as SMS from 'expo-sms';
import Expo from 'expo';

const CustomerListItem = ({ data, _editCustomer, _deleteCustomer }) => {

    const [loading, setLoading] = useState(true);

    let customerPhotosArr;
    let latestPhotoURL;

    if (data.customerPhotos && data.customerPhotos.length > 0) {
        customerPhotosArr = data.customerPhotos;
        latestPhotoURL = customerPhotosArr[customerPhotosArr.length - 1];
    }

    const _onLoadEnd = () => {
        setLoading(false)
    }

    const sendText = async () => {
        const { status } = await Expo.Permissions.askAsync(Expo.Permissions.SMS);
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            // do your SMS stuff here
            const { result } = await SMS.sendSMSAsync(
                ['3148747973'],
                'My sample HelloWorld message',
            )
        } else {
            //There's no SMS available on this device
        }

    }

    return (
        <View style={styles.list}>

            <Image style={styles.customerImage} source={{ uri: latestPhotoURL }} onLoadEnd={_onLoadEnd} />
            <ActivityIndicator style={styles.activityIndicator} animating={loading} />

            <View style={styles.text}>
                <Text>{data.first_name} {data.last_name}</Text>
                <Text>Notes: {data.notes}</Text>
            </View>

            <Menu style={styles.actionMenu}>
                {/* <MenuTrigger text='Select action' /> */}
                <MenuTrigger>
                    <Icon name="menu" size={20} type="Ionicons" />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => sendText} text='Send Text' />
                    <MenuOption onSelect={() => _editCustomer(data)} text='Edit' />
                    <MenuOption onSelect={() => _deleteCustomer(data)} >
                        <Text style={{ color: 'red' }}>Delete</Text>
                    </MenuOption>
                    {/* <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' /> */}
                </MenuOptions>
            </Menu>


        </View>
    )
}


export default CustomerListItem

const styles = StyleSheet.create({
    list: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: 8,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    customerImage: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
    activityIndicator: {
        position: 'absolute',
        left: 40,
    },
    actionMenu: {
        position: 'absolute',
        right: 40,
    },
    text: { marginLeft: 30 }
})
