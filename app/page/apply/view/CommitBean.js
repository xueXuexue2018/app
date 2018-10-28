import {Component} from 'react';
import {BaseApplyBean} from './BaseApplyBean';
import {Button, InputItem} from 'antd-mobile-rn';
import React from "react";

export class CommitBean extends BaseApplyBean {

    constructor(props){
        super(props);
    }

    checkInput = (value) => {
        return true;
    };

    onChange = (value) => {
        this.value = value;
    };

    renderContentView() {
        let props = this.props;

        return <Button
            type = 'primary'
            onClick = {
                    props.onClick
            }
        >{props.label}</Button>
    }

}
