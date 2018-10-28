import {Component} from 'react';
import {BaseApplyBean} from './BaseApplyBean';
import {InputItem} from 'antd-mobile-rn';
import React from "react";
import {Picker, List} from 'antd-mobile-rn';

export class SelectedInputBean extends BaseApplyBean {

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
        this.state.data = props.data;
        if (props.saveData != undefined){
            props.saveData(this.commitDataWithValue(props.defaultValue[0]));
        }
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
                               props.saveData(this.commitDataWithValue(value[0]));
                           }
                       }}
        >
            <List.Item arrow="horizontal">{this.state.label}</List.Item>
        </Picker>
    }

}
