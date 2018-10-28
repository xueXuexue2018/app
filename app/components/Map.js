import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    WebView
} from 'react-native';
import NavgationBar from './NavgationBar';

export default class Map extends Component{
    constructor(props) {
        super(props);
        this.state = {
            url: "./Map.html", //地图地址
            html: `
            <!DOCTYPE html>  
            <html>  
            <head>  
                <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />  
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  
                <title>Baidu Map </title>  
                <style type="text/css">  
                    html{height:100%}  
                    body{height:100%;margin:0px;padding:0px}  
                    #container{height:100%}  
                </style>  
            </head>  
            <body>
            131332
                <div id="container"></div>
                <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=LRc2kZmdzwojOlP1G5cl7dubjG7LMEMs"></script>
                <script>
                    window.onload = function(){
                        alert(111);
                        var map = new BMap.Map("container");          // 创建地图实例  
                        alert(222);
                        var point = new BMap.Point(116.404, 39.915);  // 创建点坐标  
                        alert(333);
                        map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
                        alert(444);  
                        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                    }
                </script>
            </body>  
            </html>
            `
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavgationBar
                    style={{backgroundColor:'#028ce5'}}
                    title='添加加油记录'
                    leftButton={<TouchableOpacity style={{wdith:50,padding:10}} onPress={()=>this.props.navigation.pop()}><Image style={{flex:1}} source={require('../res/img/back_up.png')} /></TouchableOpacity>}
                />
                <WebView
                // ref={WEBVIEW_REF}
                automaticallyAdjustContentInsets={false}
                style={styles.webView}
                source={{html: this.state.html}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                decelerationRate="normal"
                // onNavigationStateChange={this.onNavigationStateChange}
                // onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                startInLoadingState={true}
                // scalesPageToFit={this.state.scalesPageToFit}
            />

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    webView:{
        flex: 1,
    }
})