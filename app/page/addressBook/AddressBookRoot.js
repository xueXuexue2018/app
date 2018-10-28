import React from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import AddressBook from "./AddressBook";
import AddressBookDetails from './AdressBookDetails';

export const AddressBookRoot = StackNavigator({
    AddressBook: {
        screen: AddressBook,
        navigationOptions:({ navigation }) => ({
            headerTitle:'通讯录',
            headerTitleStyle:{color:'#fff',flex: 1,textAlign:'center'},
            headerStyle:{backgroundColor:'#028ce5'},
            headerLeft:(
                <TouchableOpacity style={{width:50}} onPress={()=>navigation.openDrawer()}>
                    <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/menu.png')} />
                </TouchableOpacity>
            ),
            headerRight:(
                <View style={{width:50}}></View>
            )
        })
    },
    AddressBookDetails: {
        screen: AddressBookDetails,
        navigationOptions:({ navigation }) => ({
            headerTitle:'通讯录详情',
            headerTitleStyle:{color:'#fff'},
            headerStyle:{backgroundColor:'#028ce5'},
        })
    }
}, {
    headerMode: 'none',
    initialRoute: 'AddressBook'
});