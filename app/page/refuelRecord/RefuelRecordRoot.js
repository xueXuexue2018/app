import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import RefuelRecordList from './RefuelRecordList';
import AddRefuelRecord from './AddRefuelRecord';
// import Map from '../../components/Map';

export const RefuelRecordRoot = StackNavigator({
        RefuelRecordList: {
            screen: RefuelRecordList,
            navigationOptions:({ navigation }) => ({
                headerTitle: '加油记录',
                headerTitleStyle:{
                    color: '#fff',
                    alignSelf: 'center'
                },
                headerStyle: {
                    backgroundColor: '#028ce5',
                },
                headerLeft:(
                    <TouchableOpacity onPress={()=>navigation.openDrawer()}>
                        <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/menu.png')} />
                    </TouchableOpacity>
                ),
            })
        },
        AddRefuelRecord: {
            screen: AddRefuelRecord,
            navigationOptions:({ navigation }) => ({
                headerTitle:'添加加油记录',
                // headerLeft:(
                //     <TouchableOpacity onPress={()=>navigation.goBack()}>
                //         <Text>返回</Text>
                //     </TouchableOpacity>
                // ),
            })
        }
    },
    {
        initialRouteName: 'RefuelRecordList',
        headerMode: 'none'
    }
);