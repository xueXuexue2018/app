import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native';
import HttpUtil from "../../components/HttpUtil";
import { Toast } from 'antd-mobile-rn';
import NavgationBar from '../../components/NavgationBar';

export default class AddressBook extends Component{
    constructor(props){
        super(props)
        this.state = {
            session: '',
            data: '',
            sData: []
        }
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret });
            this.findAllUserInfo()
        })
    }
    static navigationOptions = {
        drawerLabel: '通讯录'
    }
    //获取通讯录
    findAllUserInfo(){
        let fd = new FormData();
        fd.append('session',this.state.session);
        HttpUtil.post('/carManage/phone/userInfo/findAllUserInfo',fd)
            .then(result=>{
                if(result.code == 1){
                    let d = JSON.parse(result.content);
                    this.setState({
                        data: d
                    })
                }else if(result.code == 2){
                    Toast.info(result.content,2);
                }else if(result.code == 3){
                    Toast.fail(result.content,2);
                    this.props.navigation.navigate('Login');
                }else if(result.code == 4){
                    Toast.fail(result.content,2);
                }
            })
            .catch(error=>{
                Toast.fail(error,2);
            })
    }
    search(t){
        const arr = this.state.data;
        let d = [];
        for(let i = 0; i < arr.length; i++ ){
            let name = arr[i].userName;
            if(name.indexOf(t) != -1){
                d.push(arr[i]);
            }
        }
        this.setState({
            sData: d
        })
    }
    render(){
        return(
            <View style={styles.container}>
                <NavgationBar
                    title='通讯录'
                    statusBar={{backgroundColor:'#028ce5'}}
                    leftButton={
                        <TouchableOpacity onPress={()=>this.props.navigation.openDrawer()}>
                            <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/menu.png')}/>
                        </TouchableOpacity>
                    }
                />
                <View style={styles.searchBox}>
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="搜索"
                        underlineColorAndroid= 'transparent'
                        onChangeText={(text)=>this.search(text)}//输入框改变触发的函数
                    />
                </View>
                <FlatList
                    data={this.state.sData.length>0 ? this.state.sData : this.state.data}
                    renderItem={({item}) => <TouchableOpacity style={styles.item} onPress={()=>this.props.navigation.navigate('AddressBookDetails',{phone:item.phone,name:item.userName})}>
                        <Image source={require('../../res/img/people.png')}/>
                        <View style={styles.itemnp}>
                            <Text>{item.userName}</Text>
                            <Text>{item.phone}</Text>
                        </View>
                    </TouchableOpacity>}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    item:{
        height:50,
        borderBottomWidth: 1,
        borderBottomColor: '#999',
        flexDirection: 'row'
    },
    itemnp:{
        flex:1,
        justifyContent:'center',
        paddingLeft: 10
    },
    searchBox:{
        height: 60,
        backgroundColor:'#f4f4f4',
        // borderBottomColor:'#999',
        // borderBottomWidth:1,
        padding: 10
    },
    inputStyle:{
        flex:1,
        backgroundColor: '#fff',
        textAlign: 'center',
        borderRadius: 6
    },
})

