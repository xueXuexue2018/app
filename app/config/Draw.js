import React from 'react';
import { createDrawerNavigator } from 'react-navigation';
import { CurrentTaskRoot } from '../page/currentTask/CurrentTaskRoot';
import { ApplyRoot } from '../page/apply/ApplyRoot';
import { ApprovalRoot } from '../page/approval/ApprovalRoot';
import { TaskSchedulingRoot } from '../page/taskScheduling/TaskSchedulingRoot';
import { RefuelRecordRoot } from '../page/refuelRecord/RefuelRecordRoot';
import { HandoverCarRoot } from '../page/handoverCar/HandoverCarRoot';
import { AddressBookRoot } from '../page/addressBook/AddressBookRoot';
import SetUp from '../page/SetUp';
import CancellM from '../page/CancellM';

export const DrawerNav = createDrawerNavigator({
    CurrentTaskRoot: {
        screen: CurrentTaskRoot,
        navigationOptions: {
            drawerLabel: '当前任务'
        }
    },
    Apply: {
        screen: ApplyRoot,
        navigationOptions: {
            drawerLabel: '我的申请'
        }
    },
    Approval: {
        screen: ApprovalRoot,
         navigationOptions: {
             drawerLabel: '我的审核'
         }
    },
    TaskScheduling: {
        screen: TaskSchedulingRoot,
        navigationOptions: {
            drawerLabel: '任务调度'
        }
    },
    RefuelRecordList: {
        screen: RefuelRecordRoot,
        navigationOptions: {
            drawerLabel: '加油记录'
        }
    },
    HandoverCar: {
        screen: HandoverCarRoot,
        navigationOptions: {
            drawerLabel: '交接车'
        }
    },
    AddressBook: {
        screen: AddressBookRoot,
        navigationOptions: {
            drawerLabel: '通讯录'
        }
    },
    SetUp: {
        screen: SetUp,
        navigationOptions: {
            drawerLabel: '设置'
        }
    },
    CancellM: {
        screen: CancellM,
        navigationOptions: {
            drawerLabel: '注销'
        }
    }
}, {
    drawerWidth: 150, // 抽屉宽
    drawerPosition: 'left', // 抽屉在左边还是右边
    contentOptions: {
        initialRouteName: CurrentTaskRoot, // 默认页面组件
        activeTintColor: '#028ce5',  // 选中文字颜色
        activeBackgroundColor: '#fff', // 选中背景颜色
        inactiveTintColor: '#000',  // 未选中文字颜色
        inactiveBackgroundColor: '#fff', // 未选中背景颜色
        style: {  // 样式

        }
    }
});