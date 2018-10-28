import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet, TextInput,
    Image,
    ScrollView
} from 'react-native';
import {Icon, NavBar, Toast} from "antd-mobile-rn";
import NavgationBar from "../../components/NavgationBar";
import HttpUtil from "../../components/HttpUtil";
var info ;
export default class CurrentTaskDetailsStop extends Component{
    constructor(props) {
        super(props);
        info = this.props.navigation.state.params.info;

        this.state = {
            stopReason:''
        }
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret });
        })
    }
    stop()
    {
        if(this.state.stopReason === ''){
            Toast.fail('请输入理由', 2);
            return false
        }
        let data = new FormData();
        data.append("session",this.state.session);
        data.append("jobId",info.jobId);
        HttpUtil.post('/carManage/phone/carJobs/cancelJob',data)
            .then(result=>{
                if(result.code === 1){
                    Toast.info(result.content,2);
                    this.props.navigation.state.params.refresh;
                    this.props.navigation.pop();
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
    getstopReason(text){
        this.setState({
            stopReason: text
        })
    }
    render (){
        return(
            <View   style={{flex:1}}>
                <NavgationBar
                    title='中止任务'
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
                <View  style={{backgroundColor:'#8B8878',flex:1}}>
                    <Text style={styles.txtStyle}> {'单    号：'+info.jobId}</Text>
                    <Text style={styles.txtStyle}> {'起    点：'+info.startPlace} </Text>
                    <Text style={styles.txtStyle}> {'终    点：'+info.destination} </Text>
                    <Text style={styles.txtStyle}> {'申 请 人：'+info.applyPerson}</Text>
                    <Text style={styles.txtStyle}> {'联系电话：'+info.telephone}</Text>
                    <Text style={styles.txtStyle}> {'车辆类型：'+info.carType===1?'车辆类型：小车':info.carType===2?'车辆类型：面包车':'车辆类型：中巴车'}</Text>
                    <Text style={styles.txtStyle}> {'车牌号：'+info.plateNumber} </Text>
                    <Text style={styles.txtStyle}> {'接人数量：'+info.personCount} </Text>
                    <Text style={styles.txtStyle}> {'航班车次：'+info.flight} </Text>
                    <Text style={styles.txtStyle}> {'司    机：'+info.driverName} </Text>
                    <Text style={styles.txtStyle}> {'申请单位：'+info.accompanyPerson} </Text>
                    <Text style={styles.txtStyle}> {'备    注：'+info.remark}</Text>
                    <View style={styles.listHeader} >
                        <Text style={styles.txtStyle}> 图    片： </Text>
                        <Image source={{uri:info.fileUrl===""? HttpUtil.IP+'/carManage/phone/skipPage/downloadFileUrl?fileUrl='+info.fileUrl+'&session='+this.state.session:""}}
                               style={styles.imageStyle} />
                    </View>
                    <View style={{flexDirection:'row',backgroundColor:'#F5F5F5'}}>
                    <TextInput
                        onChangeText={(text)=>this.getstopReason(text)}//输入框改变触发的函数
                        style={styles.inputStyle}
                        placeholder="请输入取消理由"
                    />
                        <View style={styles.okView}>
                            <Text style={styles.okText}

                                  onPress={()=>{//回调刷新上个页面
                                      this.stop();
                                      }}> 确 定 </Text>
                        </View>
                    </View>
                </View>
                </ScrollView>
            </View>
                )
        }
}
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
    var display='接人';
    switch (val) {
        case 1:
            display='接人';
            break;
        case 2:
            display='送人';
            break;
        case 3:
            display='取货';
            break;
        case 4:
            display='送货';
            break;
        case 5:
            display='公务';
            break;
        case 6:
            display='调研';
            break;
        case 7:
            display='接待';
            break;
    }
    return display;
}
const styles=StyleSheet.create({
    head:{

    },
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
    inputStyle:{
        flex:1,
        margin:10,
        backgroundColor:'#fff',
        marginBottom: 10,
        borderRadius: 10,
    },
    okView:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingRight:10,
        paddingLeft:10,
        margin:10,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#028ce5',
        backgroundColor:'#fff',
        textAlign:'center',
    },
    okText:{
        fontSize:18,
        color:'#028ce5',

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