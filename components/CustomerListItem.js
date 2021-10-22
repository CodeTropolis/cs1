import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'


const CustomerListItem = ({ data, _editCustomer }) => {
    return (
        <TouchableOpacity onPress={() => _editCustomer(data)} >
            <Text style={styles.list} >{data.first_name} {data.last_name} | Notes: {data.notes}</Text>
        </TouchableOpacity>
    )
}


export default CustomerListItem

const styles = StyleSheet.create({
    list: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 10,
        marginTop: 8,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
})
