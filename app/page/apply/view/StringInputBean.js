import {Component} from 'react';
import {BaseApplyBean} from './BaseApplyBean';
import {InputItem,Toast} from 'antd-mobile-rn';
import React from "react";
import {StyleSheet} from 'react-native';

export class StringInputBean extends BaseApplyBean {

    constructor(props){
        super(props);
        // console.log("打印出this : "+this);
    }

    checkInput = (value) => {
        let type = this.props.type;
        if (type =='number'){
            return this.checkNumberOrFloat(value);
        }
        // if (type =='phone'|| type =='number' ||type =='digit'||type=='money'){
        //     return this.checkNumberOrFloat(value);
        // }
        return !(value === undefined || value === '' || value == null);
    };

    // checkPhone(value){
    //     var phoneEL =  new RegExp('^1\\d{10}','i');
    //     if(!phoneEL.test(value)){
    //         Toast.fail('请输入正确的'+this.state.label);
    //         return false;
    //     }else{
    //         return true;
    //     }
    // }

    //检查大于等于0的整数或小数
    checkNumberOrFloat(value) {
        var checkEl1 = /^[0-9]*[1-9][0-9]*$/;
        var checkEl2 = /^\+{0,1}\d+(\.\d{1,2})?$/;
        if((!(
            checkEl1.test(value))
            && !checkEl2.test(value)
            )
            || value < 0) {
            Toast.fail('请输入正确的'+this.state.label+'（纯数字）');
            return false;
        }
        return true;
    }

    onChange = (value) => {
        this.value = value;
    };

    commitDataWithValue(value){
        return {id : this.state.id,value:value};
    };

    renderContentView() {
        let props = this.props;

        return <InputItem
            type = {props.type}
            style = {style.itemBg}
            placeholder={props.placeholder}
            labelNumber={7}
            clear
            onChange={(value) => {
                this.setState({value: value});
                props.onChange(this.commitDataWithValue(value));
            }}
        >{this.state.label}</InputItem>;
    }
}
const style = StyleSheet.create(
    {
        itemBg:{
            backgroundColor :'white',
            marginLeft:0,
            paddingLeft:16
        }
    }
);
