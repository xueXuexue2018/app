import React, {Component} from "react";
import {ApprovalRoot} from "./approval/ApprovalRoot";
import {AddressBookRoot} from "./addressBook/AddressBookRoot";
import {SettingRoot} from "./setting/SettingRoot";
import {CurrentTaskRoot} from "./currentTask/CurrentTaskRoot";
import {HandoverCarRoot} from "./handoverCar/HandoverCarRoot";
import {RefuelRecordRoot} from "./refuelRecord/RefuelRecordRoot";
import {TaskSchedulingRoot} from "./taskScheduling/TaskSchedulingRoot";
import {ApplyRoot} from "./apply/ApplyRoot";
import {createDrawerNavigator} from "react-navigation";
import {Text} from "react-native";

export default class JumpPage extends Component{


    render(){
        let permissionString = this.props.navigation.state.params.permissionString;
        let Nav= createDrawerNavigator(this.showNav(permissionString)
            , {
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
        return <Nav/>;
    }
    showNav=(permissionString)=>{
        // let permissionString = "#carJobs#findSelfApply#addCarJobs#jobRecord#phoneNowJob#phoneMyApplication#phoneJobSchedule#phoneCarOils#phoneCarTrans#phoneAddress#";
        permissionString = "phoneCarTrans";
        let routeMap={
            "phoneNowJob":{
                CurrentTaskRoot: {
                    screen: CurrentTaskRoot,
                    navigationOptions: {
                        drawerLabel: '当前任务'
                    }
                }
            },
            "phoneMyApplication":{
                ApplyRoot: {
                    screen: ApplyRoot,
                    navigationOptions: {
                        drawerLabel: '我的申请'
                    }
                }
            },
            "phoneMyAudit":{
                ApprovalRoot: {
                    screen: ApprovalRoot,
                    navigationOptions: {
                        drawerLabel: '我的审核'
                    }
                }
            },
            "phoneJobSchedule":{
                TaskSchedulingRoot: {
                    screen: TaskSchedulingRoot,
                    navigationOptions: {
                        drawerLabel: '任务调度'
                    }
                }
            },
            "phoneCarOils":{
                RefuelRecordRoot: {
                    screen: RefuelRecordRoot,
                    navigationOptions: {
                        drawerLabel: '加油记录'
                    }
                }
            },
            "phoneCarTrans":{
                HandoverCarRoot: {
                    screen: HandoverCarRoot,
                    navigationOptions: {
                        drawerLabel: '交接车'
                    }
                }
            },
            "phoneAddress":{
                AddressBookRoot: {
                    screen: AddressBookRoot,
                    navigationOptions: {
                        drawerLabel: '通讯录'
                    }
                }
            }
        };
        let split = permissionString.split('#');
        let route={};
        for (let i=0;i<split.length;i++){
            let permiss = split[i];
            let item = routeMap[permiss];
            if (item!=undefined){
                Object.assign(route,item);
            }
        }
        let setting = {
            SettingRoot: {
                screen: SettingRoot,
                navigationOptions: {
                    drawerLabel: '设置'
                }
            }
        };
        Object.assign(route,setting);
        return route;
    };
}


