import {BaseApplyBean} from './BaseApplyBean';
import {InputItem} from 'antd-mobile-rn';
import React from "react";
import {Button, StyleSheet, View, NativeModules,} from 'react-native';
import {Toast} from "antd-mobile-rn/lib/index.native";

export class LocationInputBean extends BaseApplyBean {

    constructor(props) {
        super(props);
        this.state.id = props.addressId;
    }

    checkInput = (value) => {
        return !(value === undefined || value === '' || value == null);
    };

    onChange = (value) => {
        this.value = value;
    };

    onMapPress = () => {
        if(this.state.value==''||this.state.value==null||this.state.value==undefined){
            Toast.fail('请先填写详细地址');
            return;
        }
        NativeModules.ImageCrop.RNOpenVC(this.state.value)
            .then(result => {
            // console.error("latitude:   " + result.latitude + "   longitude:" + result.longitude);
                if (this.props.saveLocation != undefined){
                    this.props.saveLocation(result);
                }
        }).catch(e => {

        })
    };

    renderContentView() {
        let props = this.props;

        return (
            <View style ={style.root}>
                <Button
                    title = "定位"
                    onPress={
                        this.onMapPress
                    }
                />
                <InputItem
                    style={style.itemBg}
                    placeholder={props.placeholder}
                    labelNumber={7}
                    clear
                    onChange={(value) => {
                        this.setState({value: value});
                        props.onChange(this.commitDataWithValue(value));
                    }}
                >{this.state.label}</InputItem>
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        itemBg: {
            flex :1,
            backgroundColor: 'white',
            marginLeft: 0,
            paddingLeft: 16
        },
        root :{
            flexDirection:'row-reverse'
        }
    }
);
