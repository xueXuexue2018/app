import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ListView,
    Image,
    Linking,
} from 'react-native';
import {
    List,

} from 'antd-mobile-rn';
import Tool from "../../components/Tool";
import HttpUtil from "../../components/HttpUtil";
export default class TaskItem extends Component{
    constructor(props){
        super(props);
    }

    render(){

    return(
        <View>
            {this.renderCommon()}
            {this.renderJobType1(this.props.jobType)}
            {this.renderJobType3(this.props.jobType)}
            {this.renderJobType5(this.props.jobType)}
            {this.renderFooter()}
        </View>
    )

    }
    //公共的
    renderCommon(){
        var content=this.props.dataSource;
        return(
            <List>
                <List.Item extra={content.jobId}>
                    单号:
                </List.Item>
                <List.Item extra={content.startAddress}>
                    起点:
                </List.Item>
                <List.Item extra={content.desAddress}>
                    终点:
                </List.Item>
                <List.Item extra={content.applyPerson}>
                    申请人:
                </List.Item>
                <List.Item extra={content.contacts}>
                    联系人:
                </List.Item>
                <List.Item extra={content.telephone}
                           onClick={()=>this.linking('tel:'+content.telephone)}
                >
                    联系电话:
                </List.Item>
                <List.Item extra={Tool.getMessages(content.carType,"carType")}>
                    车辆类型:
                </List.Item>
                <List.Item extra={content.plateNumber}>
                    车牌号:
                </List.Item>
            </List>
        )
    }
    //接人-1、 送人-2、取货-3、送货-4
    renderJobType1(jobType){
        if (jobType != 1 && jobType!=2) {
            return;
        }

        var content=this.props.dataSource;
        return <List>

            <List.Item extra={content.personCount}>
                接送人数量:
            </List.Item>

            <List.Item extra={content.flight}>
                航班/车次:
            </List.Item>
            <List.Item extra={content.driverName}>
                司机:
            </List.Item>

            <List.Item extra={content.driverPhone}
                       onClick={()=>this.linking('tel:'+content.driverPhone)}
            >
                司机电话:
            </List.Item>

        </List>
    }

    renderJobType3(jobType) {
        if (jobType != 3 && jobType!=4) {
            return;
        }
        var content=this.props.dataSource;
        return <List>
            <List.Item extra= {content.goodsName}>
                品名:
            </List.Item>

            <List.Item extra={content.specifications}>
                规格:
            </List.Item>

            <List.Item extra={content.goodsCount}>
                货物数量:
            </List.Item>

        </List>
    }

    renderJobType5(jobType) {
        if (jobType != 5) {
            return;
        }

        var content=this.props.dataSource;
        return <List>
            <List.Item extra={content.workDescription}>
                公务说明:
            </List.Item>

        </List>
    }

    renderFooter(){
        var content=this.props.dataSource;

        return(
            <List>
                <List.Item extra={content.accompanyPerson}>
                    申请单位:
                </List.Item>
                <List.Item extra={content.remark}>
                    备注:
                </List.Item>
                <List.Item extra={this.getImg(content)}>
                   图片:
                </List.Item>
            </List>
        )
    }

    getImg(content){
        if (content.fileUrl) {
            return <Image
                style={{height:100,width:80}}
                source={{uri: HttpUtil.IP + '/carManage/phone/skipPage/downloadFileUrl?fileUrl=' + content.fileUrl + '&session=' + this.props.session}}/>;
        }else{
            return null;
        }
    }

    //打电话
    linking(url){
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

}
const styles = StyleSheet.create({
    txtStyle:{
        marginLeft:20,
        backgroundColor:'white',
        marginBottom:1,
        height:40,
        width:'70%',
        justifyContent:'center',
        alignItems:'center',
        lineHeight:40,
    },
    //文本的view
    textView:{
        backgroundColor:'white',

    },

});