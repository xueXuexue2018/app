import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Image,
    AsyncStorage,
    Alert
} from 'react-native';
import { Toast } from 'antd-mobile-rn';
import HttpUtil from '../components/HttpUtil';
const CryptoJS = require('crypto-js');
import Storage from 'react-native-storage';

var storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,
    // 指定存储引擎,如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,
    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: null,
    enableCache: true,
    //sync: require('你可以另外写一个文件专门处理sync')
});
global.storage = storage;

export default class Login extends PureComponent{
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            pw: '',

        }
    }

    componentDidMount(){

        storage.load({
            key: 'userName'
        }).then(ret => {
            if(ret){
                this.setState({ userName: ret });
            }
        })


    }
    onSubmit(){
        let fd = new FormData();
        if(this.state.userName == ''){
            Toast.fail('请输入用户名 !!!', 2);
            return false
        }
        if(this.state.pw == ''){
            Toast.fail('请输入密码 !!!', 2);
            return false
        }
        let pwMd5 = CryptoJS.MD5(this.state.pw);
        let keyHex = CryptoJS.enc.Utf8.parse('thkjnscw');
        let encrypted = CryptoJS.DES.encrypt(pwMd5.toString(), keyHex, {
                mode: CryptoJS.mode.ECB,
                padding:CryptoJS.pad.Pkcs7
            }
        );
        let pwDes = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
        this.setState({
            result: pwDes
        });
        fd.append("loginNumber",this.state.userName);
        fd.append("password", pwDes);
        HttpUtil.post('/carManage/phone/login/checkLogin',fd)
        // .then(()=>Toast.loading('Loading...',0))
            .then(result=>{
                if(result.code == 1){
                    Toast.success('登录成功！', 1);
                    let d = JSON.parse(result.content);
                    let obj = {
                        "session":d.session,
                        "userName":this.state.userName,
                        "imgUrl":{
                            meetImage:d.meetImage,
                            returnImage:d.returnImage,
                            oilsImage:d.oilsImage,
                            applyCarImage:d.applyCarImage
                        }
                    };
                    for (k in obj){
                        storage.save({
                            key: k,
                            data: obj[k]
                        })
                    }
                    return d.session;
                    // this.props.navigation.navigate('Jump');
                }else if(result.code == 2){
                    Toast.info(result.content,2);
                }else if(result.code == 3){
                    Toast.fail(result.content,2);
                }else if(result.code == 4){
                    Toast.fail(result.content,2);
                }
            })
            .then((session)=>{
                let formData = new FormData();
                formData.append('session',session);
                HttpUtil.post('/carManage/phone/userInfo/findSelfUserInfo',formData)
                    .then((result)=>{
                        let content = JSON.parse(result.content);
                        let permissionString = content[0].permissionString;
                        this.props.navigation.navigate('Jump',{permissionString:permissionString});
                    });
            })
            .catch(error=>{
                Alert.alert(error)
            })
    }
    getLoginNumber(text){
        this.setState({
            userName: text
        })
    }
    getPassword(text){
        this.setState({
            pw: text
        })
    }

    render(){
        return(
            <View style={styles.contaner}>
                <ImageBackground style={styles.bgImg} source={require('../res/img/qstd_login_bg.png')} resizeMode='cover'>
                    <View style={styles.headStyle}>
                        <Image style={styles.logoStyle} source={require('../res/img/yxcw_logo1.png')}/>
                        <Text style={styles.titleStyle}>广州南沙区政务</Text>
                        <Text style={styles.titleStyle}>车辆管理系统</Text>
                    </View>
                    <View style={styles.accountStyle}>
                        <TextInput
                            onChangeText={(text)=>this.getLoginNumber(text)}//输入框改变触发的函数
                            style={styles.inputStyle}
                            placeholder="请输入账号"
                            underlineColorAndroid= 'transparent'
                            value={this.state.userName}
                        />
                        <TextInput
                            onChangeText={(text)=>this.getPassword(text)}//输入框改变触发的函数
                            style={styles.inputStyle}
                            placeholder="请输入密码"
                            underlineColorAndroid= 'transparent'
                            secureTextEntry = {true}
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={()=> this.onSubmit()}
                        style={styles.loginStyle}
                    >
                        <Text style={styles.loginTitle}>登录</Text>
                        <Image style={styles.loginImg} source={require('../res/img/right.png')}/>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    contaner:{
        flex: 1,
    },
    bgImg:{
        flex:1
    },
    headStyle:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:30,
    },
    logoStyle:{
        width:80,
        height:80,
        marginBottom:30,
        marginTop:30
    },
    titleStyle:{
        color:'white',
        fontSize:30,
    },
    accountStyle:{
        marginBottom:10,
        paddingLeft: 20,
        paddingRight:20,
    },
    inputStyle:{
        height:50,
        backgroundColor:'#fff',
        marginBottom: 10,
        borderRadius: 10,
    },
    loginStyle:{
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems: 'center',
        paddingRight: 20
    },
    loginTitle:{
        fontSize: 30,
        color: '#fff'
    },
    loginImg:{
        width: 40,
        height: 30
    }
}) 