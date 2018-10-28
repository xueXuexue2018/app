import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View,
    Button,
    StyleSheet,
    Image,
} from 'react-native';
import { createDrawerNavigator,SwitchNavigator } from 'react-navigation';

import { CurrentTaskRoot } from '../page/currentTask/CurrentTaskRoot';
import { ApplyRoot } from '../page/apply/ApplyRoot';
import { ApprovalRoot } from '../page/approval/ApprovalRoot';
import { TaskSchedulingRoot } from '../page/taskScheduling/TaskSchedulingRoot';
import { RefuelRecordRoot } from '../page/refuelRecord/RefuelRecordRoot';
import { HandoverCarRoot } from '../page/handoverCar/HandoverCarRoot';
import { AddressBookRoot } from '../page/addressBook/AddressBookRoot';
import { SettingRoot } from '../page/setting/SettingRoot';
import Login from '../page/Login';

const DrawerNav = createDrawerNavigator({
    CurrentTaskRoot: {
        screen: CurrentTaskRoot,
        navigationOptions: {
            drawerLabel: '当前任务'
        }
    },
    ApplyRoot: {
        screen: ApplyRoot,
        navigationOptions: {
            drawerLabel: '我的申请'
        }
    },
    ApprovalRoot: {
        screen: ApprovalRoot,
         navigationOptions: {
             drawerLabel: '我的审核'
         }
    },
    TaskSchedulingRoot: {
        screen: TaskSchedulingRoot,
        navigationOptions: {
            drawerLabel: '任务调度'
        }
    },
    RefuelRecordRoot: {
        screen: RefuelRecordRoot,
        navigationOptions: {
            drawerLabel: '加油记录'
        }
    },
    HandoverCarRoot: {
        screen: HandoverCarRoot,
        navigationOptions: {
            drawerLabel: '交接车'
        }
    },
    AddressBookRoot: {
        screen: AddressBookRoot,
        navigationOptions: {
            drawerLabel: '通讯录'
        }
    },
    SettingRoot: {
        screen: SettingRoot,
        navigationOptions: {
            drawerLabel: '设置'
        }
    }
}, {
    drawerWidth: 150, // 抽屉宽
    drawerPosition: 'left', // 抽屉在左边还是右边
    initialRouteName: 'HandoverCarRoot', // 默认页面组件
    contentOptions: {
        activeTintColor: '#028ce5',  // 选中文字颜色
        activeBackgroundColor: '#fff', // 选中背景颜色
        inactiveTintColor: '#000',  // 未选中文字颜色
        inactiveBackgroundColor: '#fff', // 未选中背景颜色
    }
});

export const Navigator = SwitchNavigator({
    Login: Login,
    Draw: DrawerNav
},
{
    initialRouteName: 'Login',
});