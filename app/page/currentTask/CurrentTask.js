import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ListView,
    Image,
} from 'react-native';
import NavgationBar from "../../components/NavgationBar";

export default class CurrentTask extends Component{
    constructor(props){
        super(props);
        this.state={
            result:'',
            title:1,
        }
    }

    renderButton(image){
        return <TouchableOpacity
            onPress={()=>{
            }
            }>
            <Image style={{width:22,height:22,margin:5}} source={image}/>
        </TouchableOpacity>
    }

    static navigationOptions = {
        drawerLabel: '当前任务'
    };
    render (){


        return(
            <View  style={styles.container}>
                <NavgationBar
                    style={{backgroundColor:'#028ce5'}}
                    leftButton={
                        this.renderButton(require('../../res/img/yxcw_logo1.png'))
                    }
                    titleView={

                        <View style={styles.titleButton}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({title:1})
                                }
                                }>
                                <Text style={this.state.title===1?styles.leftButton:styles.textButton2}  >当前任务</Text>

                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({title:2})
                                }
                                }>
                                <Text style={this.state.title===2?styles.rightButton:styles.textButton2}>我的任务</Text>
                            </TouchableOpacity>

                         </View>

                    }
                />

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
    leftButton:{
        fontSize: 20,
        color: '#028ce5',
        padding:5,
        backgroundColor:'white',
        borderBottomLeftRadius:8,
        borderTopLeftRadius:8,
    },
    rightButton:{
        fontSize: 20,
        color: '#028ce5',
        padding:5,
        backgroundColor:'white',
        borderBottomRightRadius:8,
        borderTopRightRadius:8,
    },
    textButton2:{
        fontSize: 20,
        padding:5,
        color: 'white',

    },

})