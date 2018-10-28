import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image, NativeModules,
} from 'react-native';

import NavgationBar from "../../components/NavgationBar";
import CurrentTaskDetails from "./CurrentTaskDetails";
import CurrentTaskListLeft from "./CurrentTaskListLeft";
import CurrentTaskListRight from "./CurrentTaskListRight";
import Login from "../Login"

export default class CurrentTaskList extends Component{
    static navigationOptions = {
        drawerLabel: '当前任务'
    };
    constructor(props){
        super(props);
        this.state={
            result:'',
            text:'',
            title:1,
            avatarSource: null,
            videoSource: null
        }
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret });
            })
    }



    renderButton(image){
        return <TouchableOpacity
            onPress={()=>{
                this.props.navigation.openDrawer()

            }
            }>
            <Image style={{width:22,height:22,margin:5}} source={image}/>
        </TouchableOpacity>
    }
    render(){
        return(
            <View  style={styles.container}>
                <NavgationBar
                    style={{backgroundColor:'#028ce5'}}
                    leftButton={
                        this.renderButton(require('../../res/img/menu.png'))
                    }
                    titleView={

                        <View style={styles.titleButton}>
                            <TouchableOpacity
                                onPress={()=>{this.setState({title:1})}}
                            >
                                <Text style={this.state.title===1?styles.leftButton:styles.textButton2}  >当前任务</Text>

                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{
                                    
                                    this.setState({title:2})
                                    //     NativeModules.ImageCrop.RNOpenVC("").then(result=>{
                                //
                                //         this.setState({
                                //             // text:result.
                                //         })
                                //
                                //     }).catch(e=>{
                                //
                                //     })
                                }
                                }>
                                <Text style={this.state.title===2?styles.rightButton:styles.textButton2}>我的任务</Text>
                            </TouchableOpacity>

                        </View>

                    }
                />
                {this.state.title===1?<CurrentTaskListLeft navigation={this.props.navigation}/>:<CurrentTaskListRight/>}

            </View>
        )
    }


}


const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    titleButton:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        borderWidth:1,
        borderColor:'white',
    },
    findView:{
        height:60,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        margin:10,
        borderRadius:10,
        borderWidth:1,
        borderColor:'white',
        backgroundColor:'#fff',
    },
    findText:{
        fontSize: 18,
        color: '#8B8878',
        padding:5,
    },
    leftButton:{
        fontSize: 16,
        color: '#028ce5',
        padding:5,
        backgroundColor:'white',
        borderBottomLeftRadius:8,
        borderTopLeftRadius:8,
    },
    rightButton:{
        fontSize: 16,
        color: '#028ce5',
        padding:5,
        backgroundColor:'white',
        borderBottomRightRadius:8,
        borderTopRightRadius:8,
    },
    textButton2:{
        fontSize: 16,
        padding:5,
        color: 'white',

    },

})