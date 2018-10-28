import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert
} from 'react-native';
import NavgationBar from '../../components/NavgationBar';
import {Toast,Button,List} from "antd-mobile-rn";
import HttpUtil from "../../components/HttpUtil";

export default class CancellM extends Component{
    constructor(props){
        super(props);
        this.state = {
            session: '',
        }
    }

    //渲染render之前调用
    componentDidMount(){
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret });

        })
    }
    //判断是否已接车
    zhuxiao(){
        let fd = new FormData();
        fd.append('session',this.state.session);
        HttpUtil.post('/carManage/phone/carTrans/checkIsmeet',fd)
            .then(result=>{
                if(result.code == 1) {
                    if(result.note == 1) {//已接车
                        Toast.info("暂未交车,请先完成交车操作");
                    }else{
                        Alert.alert('提示','确定注销登录？',
                            [
                                {text:"取消", onPress:()=>{}},
                                {text:"确定", onPress:()=>{this.props.navigation.navigate('Login')}}
                            ]
                        )
                    }
                }else if(result.code == 2) {
                    Toast.info(result.content,1);
                }else if(result.code == 3) {
                    Toast.info(result.content,1)
                    this.props.navigation.navigate('Login');
                }else {
                    Toast.info(result.content,1);
                }
            })

    }
    //判断是否已接车
    checkIsmeet(){

    }

    render(){
        return(
            <View style={styles.container}>
                <NavgationBar
                    statusBar={{backgroundColor: '#028ce5'}}
                    leftButton={
                        <TouchableOpacity onPress={()=>this.props.navigation.openDrawer()}>
                            <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/menu.png')} />
                        </TouchableOpacity>}
                    title={'设置'}
                />
                <List>
                    <List.Item
                        arrow='horizontal'
                        onClick={()=>this.props.navigation.navigate('SetUp')}
                    >检测更新</List.Item>
                    <List.Item
                        arrow='horizontal'
                        onClick={()=>this.zhuxiao()}
                    >退出登录</List.Item>
                </List>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f4f4f4'
    },
    img:{
        width:70,
        height:70
    },
    top:{
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item:{
        backgroundColor:'#fff',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f4',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 20,
    },
})

