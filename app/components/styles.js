'use strict';

import { StyleSheet } from "react-native";
//屏幕信息
const dimensions = require('Dimensions');
//获取屏幕的宽度和高度
const {height} = dimensions.get('window');
module.exports = StyleSheet.create({

    container: {
        flex: 1,
        // height:400,
        // flexDirection:'row',
        // justifyContent: 'flex-start',
        // alignItems: 'center',
        // backgroundColor: '#F5FCFF',
    },
    map: {
        // flex:1,
        height:height-90,
    },
    seach:{
        flexDirection:'row',
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,
        borderBottomColor:'#d5d5d5',
        borderStyle:'solid',
        borderBottomWidth:1,
    },
    input:{
        width:'70%',
        height:40,
        borderStyle:'solid',
        borderColor:'#d5d5d5',
        borderWidth:1,
        borderRadius:10
    },
    seachTou:{
        width:'30%',
    },
    seachText:{
        width:'90%',
        height: 40,
        color: '#fff',
        fontSize: 16,
        borderRadius: 10,
        backgroundColor: '#028ce5',
        lineHeight:35,
        textAlign:'center',
        marginLeft:10,
    },

});