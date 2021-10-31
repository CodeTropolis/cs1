import React, { useState } from 'react'
import { StyleSheet, Text, Image, View, ActivityIndicator } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'


const CustomerListItem = ({ data, _editCustomer }) => {

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

    return (
        <TouchableOpacity style={styles.list} onPress={() => _editCustomer(data)} >

            <Image style={styles.customerImage} source={{ uri: latestPhotoURL }} onLoadEnd={_onLoadEnd} />
            <ActivityIndicator
                style={styles.activityIndicator}
                animating={loading}
            />

            <View style={styles.text}>
                <Text>{data.first_name} {data.last_name}</Text>
                <Text>Notes: {data.notes}</Text>
            </View>
        </TouchableOpacity>
    )
}


export default CustomerListItem

const styles = StyleSheet.create({
    list: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-around',
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
    text: { marginLeft: 30 }
})
