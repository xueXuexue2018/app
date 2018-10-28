import {Component} from 'react';
import {BaseApplyBean} from './BaseApplyBean';
import {InputItem} from 'antd-mobile-rn';
import React from "react";
import {Picker, List} from 'antd-mobile-rn';

export class WorkFlowInputBean extends BaseApplyBean {

    checkInput = (value) => {
        return !(value === undefined || value === '' || value == null);
    };

    onChange = (value) => {
        this.value = value;
    };


    commitData(){
        if (this.state.isNeed && !this.checkInput(this.state.value[0])) {
            //是必填项，但是没有填
            return {}
        }  else{
            return {id : this.state.id,value:this.state.value[0]};
        }
    };

    commitDataWithValue(value){
        if (this.state.isNeed && !this.checkInput(value)) {
            //是必填项，但是没有填
            return {}
        }  else{
            return {id : this.state.id,value:value};
        }
    };

    constructor(props){
        super(props);
        this.state.value = props.defaultValue;
        //不知道为什么从外面传进来，到第三层的时候就老是拿不到值，只能传到第二层，然后到这里面再取出来
        // 一开始外面是这么传的：
        //old:      this.controller.data
        // 老是拿不到值就改成：
        // now :    this.controller
        this.state.data = props.controller.data;
        // 由于工作流有两个字段要提交，所以也不是用 id 来作为 key ，也就不用默认的提交和校验方法
        // if (props.saveData != undefined){
        //     props.saveData(this.commitDataWithValue(props.defaultValue[0]));
        // }
    }



    renderContentView() {
        let props = this.props;
        // if (this.state.value==null||this.state.value==undefined||this.state.value==''){
        //     this.setState(
        //         {value: props.defaultValue}
        //     );
        // }
        return <Picker data={this.state.data} cols={1}
                       value = {this.state.value}
                       onOk={(value) => {
                           this.setState({
                               value: value
                           });
                           props.onSelectedChange(value[0]);
                           if (props.saveData != undefined){
                               props.saveData({id:'workInfoId',value:value[0]});
                           }
                       }}
                       format={(labels)=>{
                           if (props.saveData != undefined){
                               props.saveData({id:'workName',value:labels[0]});
                           }
                           return labels.join(',');
                       }}
        >
            <List.Item arrow="horizontal">{this.state.label}</List.Item>
        </Picker>
    }

}
