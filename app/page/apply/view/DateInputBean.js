import {Component} from 'react';
import {BaseApplyBean} from './BaseApplyBean';
import {InputItem} from 'antd-mobile-rn';
import React from "react";
import {DatePicker, List} from 'antd-mobile-rn';

export class DateInputBean extends BaseApplyBean {

    constructor(props){
        super(props);
        this.state.value = null;
    }

    //由于提交的时候要使用时间戳，所以重写 提交的函数
    commitData(){
        if (this.state.isNeed && !this.checkInput(Number(this.state.value))) {
            //是必填项，但是没有填
            return {}
        }  else{
            return {id : this.state.id,value:Number(this.state.value)};
        }
    };

    checkInput = (value) => {
        return !(value === undefined || value === '' || value == null);
    };

    onChange = (value) => {
        this.value = value;
    };

    componentDidMount(){
        super.componentDidMount();
        // if (this.props.onChange!=undefined){
        //     this.props.onChange(this.commitDataWithValue(Number(this.state.value)));
        // }
    }

    renderContentView() {
        let props = this.props;
        return <DatePicker
            value={this.state.value}
            minuteStep = {1}
            minDate = {new Date()}
            onOk={(date) => {
                console.log('获取到时间：'+date);
                this.setState({value: date});
                props.onChange(this.commitDataWithValue(Number(date)));
            }
            }
        >
            <List.Item arrow="horizontal"
            >{this.state.label}</List.Item>
        </DatePicker>;
    }

}
