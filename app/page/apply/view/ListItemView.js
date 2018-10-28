import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

export default class ListItemView extends Component {
    constructor(props){
        super(props);
    }

    render() {
        let data = this.props.data.item;
        console.log('item get data: '+ data.jobType);
        let jobType;
        if(data.jobType == 1) {
            jobType = "接人";
        } else if(data.jobType == 2) {
            jobType = "送人";
        } else if(data.jobType == 3) {
            jobType = "取货";
        } else if(data.jobType == 4) {
            jobType = "送货";
        } else if(data.jobType == 5) {
            jobType = "公务";
        } else if(data.jobType == 6) {
            jobType = "调研";
        } else if(data.jobType == 7) {
            jobType = "接待";
        }
        let status;
        if(data.status == 1) {
            status = "待派";
        } else if(data.status == 2) {
            status = "待完成";
        } else if(data.status == 3) {
            status = "已完成";
        } else if(data.status == 4) {
            status = "已取消";
        } else if(data.status == 5) {
            status = "已退回";
        }
        let reviewStatus;
        if(data.reviewStatus==1){
            reviewStatus='审核中';
        }else if(data.reviewStatus==2){
            reviewStatus='审核不通过';
        }else if(data.reviewStatus==3){
            reviewStatus='审核通过';
        }else if(data.reviewStatus==4){
            reviewStatus='已取消';
        }else if(data.reviewStatus==5){
            reviewStatus='不需要审核';
        }
        let startTime = data.startTime;
        let desTime = data.desTime;
        let startPlace = data.startPlace;
        let destination = data.destination;
        return (
           <TouchableOpacity
               onPress = {
                   () =>{
                       this.props.navigation.navigate('ApplyDetails',
                           {
                               jobId: data.jobId,
                               workProcessInfoId: data.workProcessInfoId,
                               workInfoId: data.workInfoId
                           }
                       )
                   }
               }
           >
            <View style = { {height : 158} }>
                <View style={style.rootLayout}>
                    <Text style={[style.typeText,this.color(data.jobType)]}>{jobType}</Text>
                    <View style={style.content_root}>
                        <Text style={style.content_left}>{this.transTime(startTime)} 从 {startPlace}</Text>
                        <Text style={style.content_left}>{this.transTime(desTime)} 到 {destination}</Text>
                        <Text style={style.content_right}>审核状态：{reviewStatus}</Text>
                        <Text style={style.content_right}>任务状态：{status}</Text>
                    </View>
                </View>
                <View style={style.line}/>
            </View>
               <View style={style.line}/>
           </TouchableOpacity>
        );
    }

    //转换日期，日期格式：yyyy-MM-dd HH:mm:ss
    transTime(val) {
        var display;
        var date = new Date();
        date.setTime(val);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        hour = hour < 10 ? "0" + hour : hour;
        minute = minute < 10 ? "0" + minute : minute;
        display = year + "-" + month + "-" + day + "  " + "  " + hour + ":" + minute;
        return display;
    }
    color(t){
        let arr = [
            style.state01,
            style.state02,
            style.state03,
            style.state04,
            style.state05,
            style.state06
        ];
        return arr[t];
    }

}

const height = 158;
const style = StyleSheet.create({
    rootLayout: {
        flexDirection: 'row',
        height: height,
    },
    typeText: {
        backgroundColor: '#0287DF',
        width: 26,
        color: 'white',
        fontSize:18,
        paddingLeft:4,
        textAlignVertical: 'center'
    },
    content_root: {
        flex: 1,
        backgroundColor:'white'
    },
    content_left: {
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'left',
        marginLeft: 20,
        fontSize:18,
        color:'black'
    },
    content_right: {
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'right',
        marginRight: 20
    },
    line: {
        height: 2,
        backgroundColor: '#eeeeee'
    },
    state01:{
        backgroundColor:'#0287DF'
    },
    state02:{
        backgroundColor:'#5AC8FB'
    },
    state03:{
        backgroundColor:'#FFCA00'
    },
    state04:{
        backgroundColor:'#FF9501'
    },
    state05:{
        backgroundColor:'#51D767'
    },
    state06:{
        backgroundColor:'#4BDB5F'
    },

});