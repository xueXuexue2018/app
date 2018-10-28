import {Component} from 'react';
import {BaseApplyBean} from './BaseApplyBean';
import {Button} from 'antd-mobile-rn';
import React from "react";
import {Image, Text, View,StyleSheet} from "react-native";
import {Toast} from "antd-mobile-rn/lib/index.native";

export class ImageInputBean extends BaseApplyBean{
    constructor(props){
        super(props);
    }
    checkInput(){
        console.error('当前还没有定义检查输入的方法');
        return false;
    };

    renderContentView() {
        let props = this.props;
        return  <View>
                    <Text style={styles.title}>{props.label}</Text>
                    <View style={{justifyContent:'center',alignItems:'center',marginBottom:10}}>
                    <Image source={{uri:this.state.imgSrc}}
                            style={{width:120,height:120}}/>
                    </View>
                    <Button
                        onClick = {()=>{
                            let imgPromise = props.uploadPic();
                            imgPromise.then((imgSrc)=>{
                                if(imgSrc!=null){
                                    this.setState({
                                        imgSrc : imgSrc
                                    });
                                }
                            })

                        }}
                    >上传图片</Button>
                </View>;
    }
}

const styles = StyleSheet.create(
    {
        title:{
            fontSize:18,
            color:'black',
            backgroundColor:'white',
            paddingLeft:16,
            paddingTop:10,
            paddingBottom:10
        }
    }
);