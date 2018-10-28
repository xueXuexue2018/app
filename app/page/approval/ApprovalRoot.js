import React from 'react';
import {
    TouchableOpacity,
    Image,
    View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import  ApprovalDetails from  './ApprovalDetails';
import  ApprovalList from './ApprovalList';
import  ApprovalOpinion from './ApprovalOpinion';

export const ApprovalRoot = StackNavigator(
    {
        ApprovalList: {
            screen: ApprovalList,
            navigationOptions:({ navigation }) => ({
                headerTitle:'我的审核',
                headerTitleStyle:{color:'#fff',flex: 1,textAlign:'center'},
                headerStyle:{backgroundColor:'#028ce5'},
                headerLeft:(
                    <TouchableOpacity style={{width:50}} onPress={()=>navigation.openDrawer()}>
                        <Image source={require('../../res/img/menu.png')} />
                    </TouchableOpacity>
                ),
                headerRight:(
                    <View style={{width:50}}></View>
                )
            })
        },
        ApprovalDetails: {
            screen: ApprovalDetails,
            navigationOptions:({ navigation }) => ({
                headerTitle:'审核详情',
                headerTitleStyle:{color:'#fff',flex: 1,textAlign:'center'},
                headerStyle:{backgroundColor:'#028ce5'},
            }),
        },
        ApprovalOpinion:{
            screen:ApprovalOpinion,
            navigationOptions:({ navigation }) => ({
                headerTitle:'填写审核意见',
                headerTitleStyle:{color:'#fff',flex: 1,textAlign:'center'},
                headerStyle:{backgroundColor:'#028ce5'},
            }),
            headerRight:(
                <View style={{width:50}}></View>
            )
        },
    },
    {
        initialRouteName: 'ApprovalList',
        headerMode: 'none'
    }
);