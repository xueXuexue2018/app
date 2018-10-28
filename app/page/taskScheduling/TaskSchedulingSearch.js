import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import{
    Button,
    Flex,
    Toast,
    Picker,
    DatePicker,
    List,
    InputItem
} from 'antd-mobile-rn';
import HttpUtil from '../../components/HttpUtil';
import Tool from '../../components/Tool';
import NavgationBar from '../../components/NavgationBar';
export default class TaskSchedulingSearch extends Component{
    constructor(props){
        super(props);
        this.state = {
            carType: new Array(this.props.navigation.getParam('carType')),//用车类型
            selectPlace:this.props.navigation.getParam('selectPlace'), //过滤地点
            selectDate: new Date(this.props.navigation.getParam('selectDate')),//用车日期
            tpData: [
                {label: '全部', value: '0'},
                {label: '小车', value: '1'},
                {label: '面包车', value: '2'},
                {label: '中巴车', value: '3'}]
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <NavgationBar
                    title='搜索'
                    statusBar={{backgroundColor:'#028ce5'}}
                    leftButton={
                        <TouchableOpacity style={{width:50}} onPress={()=>this.props.navigation.goBack()}>
                            <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/back.png')}/>
                        </TouchableOpacity>
                    }
                />
                <List>
                    <DatePicker
                        value={this.state.selectDate}
                        mode="date"
                        onChange={(v)=>this.setState({selectDate:v})}
                        format="YYYY-MM-DD"
                    >
                        <List.Item arrow="horizontal">用车日期：</List.Item>
                    </DatePicker>
                    <Picker
                        data={this.state.tpData}
                        cols={1}
                        value={this.state.carType}
                        onChange={(v)=>this.setState({carType:v})}
                    >
                        <List.Item arrow="horizontal" last>用车类型：</List.Item>
                    </Picker>
                    <InputItem
                        clear
                        value={this.state.selectPlace}
                        onChange={(v) => this.setState({selectPlace:v})}
                        placeholder="请输入过滤地点"
                        labelNumber={5}
                    >
                        过滤地点:
                    </InputItem>
                </List>
                <View style={styles.btnBox}>
                    <Button 
                        type='primary'
                        onClick={()=>{
                            this.props.navigation.goBack();
                            this.props.navigation.state.params.callBack(this.state.carType[0],this.state.selectPlace,Tool.formate(this.state.selectDate));
                        }}
                    >查询</Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f4f4f4',
    },
    btnBox:{
        marginTop: 20,
        padding: 10,
    }
    
});