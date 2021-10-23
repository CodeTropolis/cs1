import React from 'react'
import { StyleSheet, Text, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'


const CustomerListItem = ({ data, _editCustomer }) => {

    let customerPhotosArr;
    let latestPhotoURL;

    if (data.customerPhotos && data.customerPhotos.length > 0) {
        customerPhotosArr = data.customerPhotos;
        latestPhotoURL = customerPhotosArr[customerPhotosArr.length - 1];
    }

    return (
        <TouchableOpacity style={styles.list} onPress={() => _editCustomer(data)} >
            <Image style={styles.customerImage} source={{ uri: latestPhotoURL }} />
            <Text style={styles.text}>{data.first_name} {data.last_name} | Notes: {data.notes}</Text>
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
    text: { marginLeft: 30 }
})
