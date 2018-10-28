import React, { Component } from 'react';
import View from "antd-mobile-rn";
import {WebView} from "react-native";

export default class MapTest extends Component{
    render(){
        // const source = (Platform.OS == 'ios') ? require('map.html') : { html: 'file:///android_asset/html/map.html' };
        return(
                <WebView
                    source = {{ uri: 'file:///android_asset/html/map.html' }}
                    javaScriptEnabled={true}
                />
        )
    }
}