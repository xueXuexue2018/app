import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet, TextInput,
    Image,
    ScrollView
} from 'react-native';
import NavgationBar from "../../components/NavgationBar";
import HttpUtil from "../../components/HttpUtil";
import TaskItem from './TaskItem'
var info ;
import { Toast,List } from 'antd-mobile-rn';
import Tool from "../../components/Tool";
export default class CurrentTaskDetailsComplete extends Component{
    constructor(props) {
        super(props);
        info = this.props.navigation.state.params.info;
        this.state = {
        }
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret });
        })
    }

    compelte()
    {
        let data = new FormData();
        data.append("session",this.state.session);
        data.append("jobId",info.jobId);
        data.append("carId",info.carId);
        data.append("plateNumber",info.plateNumber);

        HttpUtil.post('/carManage/phone/carJobs/finishJobWithCarInfo',data)
            .then(result=>{
                if(result.code === 1){
                    Toast.info(result.content,2);
                    this.props.navigation.pop();
                    this.props.navigation.state.params.refresh(1,0);
                }else if(result.code === 2){
                    Toast.info(result.content,2);
                }else if(result.code === 3){
                    Toast.fail(result.content,2);
                    this.props.navigation.navigate('Login');
                }else if(result.code === 4){
                    Toast.fail(result.content,2);
                }
            })
            .catch(error=>{
                this.setState({
                    result: JSON.stringify(error)
                })
            })

    }
    render (){
        return(
            <View style={{flexDirection:'column',flex:1}}>
                <NavgationBar
                    title='完成任务'
                    statusBar={{
                        backgroundColor:'#028ce5'
                    }}

                    leftButton={
                        <Text style={styles.backBar}
                              onPress={()=>this.props.navigation.pop()}
                        >返回</Text>}

                />
                <ScrollView >
                <View style={styles.listHeader} >
                    <View style={styles.listHeaderText}>
                    <Text style={styles.listHeaderText}>{getSta(info.jobType)}</Text>
                    </View>
                    <View  style={{flex:1}}>
                        <Text style={styles.txtStyle}> {transTime(info.startTime)+'从'+info.startPlace}</Text>
                        <Text style={styles.txtStyle}> {transTime(info.desTime)+'从'+info.destination}</Text>
                    </View>
                </View>
                <View  style={{backgroundColor:'#8B8878'}}>

                    <TaskItem dataSource={info} jobType={info.jobType} session={this.state.session}/>
                    <View style={styles.titleButton}>

                        <Text style={styles.leftButton}
                              onPress={()=>this.props.navigation.pop()}>取 消</Text>


                        <Text style={styles.rightButton}
                              onPress={()=>this.compelte()}>确 定</Text>

                    </View>
                </View>
                </ScrollView>
            </View>
        )
        }

    //1接人丶2送人丶3取货丶4送货丶5公务丶6调研丶7接待
    typeModel(item){
        let t = item.jobType;
        if( t == 1 || t == 2){
            return(
                <View>
                    <List.Item extra={item.personCount||''}>接送人数：</List.Item>
                    <List.Item extra={item.flight||''}>航班车次：</List.Item>
                    <List.Item extra={item.driverName||''}>司机：</List.Item>
                </View>
            )
        }else if(t == 3 || t == 4){
            return (
                <View>
                    <List.Item extra={item.goodsName||''}>品名：</List.Item>
                    <List.Item extra={item.specifications||''}>单位：</List.Item>
                    <List.Item extra={item.goodsCount||''}>数量：</List.Item>
                    <List.Item extra={item.contacts||''}>联系人：</List.Item>
                </View>
            )
        }else if(t == 5){
            <List.Item extra={item.workDescription||''}>公务说明：</List.Item>
        }
    }
}

const styles=StyleSheet.create({
    listHeader:{
        flexDirection:'row',
        justifyContent:'flex-start',
        backgroundColor:"#ffffff"
    },
    listHeaderText:{
        textAlign :'center',
        justifyContent:'center',
        backgroundColor:'#028ce5',
        color:'white',
    },
    txtStyle:{
        fontSize: 16,
        backgroundColor:'#fff',
        padding:10,
        marginBottom:0.5,
    },
    titleButton:{
        flexDirection:'row',
        flexGrow:1,
        justifyContent:'center',
        alignItems:'center',
    },
    leftButton:{
        flex:1,
        fontSize: 20,
        color: 'white',
        backgroundColor:'#FF4500',
        textAlign:'center',
        justifyContent: 'center',
        padding:10,
    },
    rightButton:{
        flex:1,
        fontSize: 20,
        color: 'white',
        backgroundColor:'#028ce5',
        textAlign:'center',
        justifyContent: 'center',
        padding:10,
    },
    backBar:{
        marginLeft:20,
        color:'white',
        fontSize:20
    },
    imageStyle:{
        width: 300,
        height: 300,
        margin:5,
    }
})
//转换日期，日期格式：yyyy-MM-dd HH:mm:ss
function transTime(val) {
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
    display = month + "-" + day + "  " + "  " + hour + ":" + minute;
    return display;
}
//1接人丶2送人丶3取货丶4送货丶5公务丶6调研丶7接待
function getSta(val) {
    var display = '接人';
    switch (val) {
        case 1:
            display = '接人';
            break;
        case 2:
            display = '送人';
            break;
        case 3:
            display = '取货';
            break;
        case 4:
            display = '送货';
            break;
        case 5:
            display = '公务';
            break;
        case 6:
            display = '调研';
            break;
        case 7:
            display = '接待';
            break;
    }
    return display;
}
