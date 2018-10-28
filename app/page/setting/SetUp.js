import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
    Linking,
    Alert
} from 'react-native';
import NavgationBar from '../../components/NavgationBar';
import {Toast,Button} from "antd-mobile-rn";
import DeviceInfo from 'react-native-device-info';

export default class SetUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            vCodeold: Platform.OS=='ios'?DeviceInfo.getVersion():DeviceInfo.getBuildNumber(),
            vNameold: DeviceInfo.getVersion(),
            vCode: '',
            vName: '',
            dUrl: '',
            yhgx: '',//优化更新
            qzgx:'',//强制更新
            msg: '正在获取版本信息...'
        }
        this.updMessage()
    }

    updMessage(){
        //https://www.fbparking.cn/nscw/android/LatestVersion.txt 正式版
        //https://www.fbparking.cn/nscwTest/android/LatestVersion.txt 测试版
        //https://www.fbparking.cn/nscwTest/ios/LatestVersion.txt 测试
        //https://www.fbparking.cn/nscw/ios/LatestVersion.txt 正式
        let url = "";
        Platform.OS === 'ios' ? url="https://www.fbparking.cn/nscwTest/ios/LatestVersion.txt" : url = "https://www.fbparking.cn/nscwTest/android/LatestVersion.txt";
        fetch(url)
            .then(response=>response.blob())
            .then(result=>{
                let fr = new FileReader();
                fr.readAsText(result);
                fr.onload = (e)=>{

                    let arr = Platform.OS=='ios'?JSON.parse(e.target.result):e.target.result.split(',');

                    let a = Platform.OS=='ios'?'':arr[1].split(";");
                    this.setState({
                        vCode: Platform.OS=='ios'?arr.UpdateVersion:Number(arr[0]),
                        vName: Platform.OS=='ios'?arr.UpdateVersion:a[0],
                        dUrl: Platform.OS==='ios'?arr.URL:a[1],
                        yhgx: Platform.OS=='ios'?arr.Title:a[2],//优化更新
                        qzgx: Platform.OS=='ios'?arr.NeedUpdate:a[3],//强制更新
                        msg: Platform.OS=='ios'?arr.Content:a[4]
                    })

                }
            })
            .catch(error=>{
                Toast.fail(error,2);
            })
    }

    updMsg(){
        return this.state.vCode === this.state.vCodeold ? '已是最新版' : '最新版为：'+this.state.vName
    }

    showBtn(){
        if(this.state.vCode != this.state.vCodeold){

            return <Button type="primary" onClick={()=>this.updClick(this.state.dUrl)}>下载</Button>
        }
    }
    showBtn2(){
        if(this.state.vCode != this.state.vCodeold){

            return    <View style={styles.item}>
                <Text>版本说明：</Text>
                <Text>{this.state.msg}</Text>
            </View>
        }
    }

    //canOpenURL做一次判断，是否是有效的地址
     updClick(url){

         Linking.canOpenURL(url)
             .then((supported)=>{
                 if (!supported){
                     console.log('Can\'t handle url: ' + url);
                     Alert.alert(
                         '提示',
                         'Can\'t handle url: ' + url,
                         [
                             {text: 'OK', onPress:()=>{}}
                         ]
                     );
                 }else{
                     return Linking.openURL(url);
                 }
             })
             .catch((err)=>{
                 console.log('An error occurred', err);
                 Alert.alert(
                     '提示',
                     'An error occurred: ' + err,
                     [
                         {text: 'OK', onPress:()=>{}}
                     ]
                 );
             });
     }

    render(){
        return(
            <View style={styles.container}>
                <NavgationBar
                    statusBar={{backgroundColor: '#028ce5'}}
                    leftButton={
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                            <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/back.png')} />
                        </TouchableOpacity>}
                    title={'检测更新'}
                />

                <View style={styles.top}>
                    <Image style={styles.img} source={require('../../res/img/update_icon.png')} />
                    <Text style={{marginTop:10}}>版本号：{this.state.vNameold}</Text>
                </View>

                <View style={styles.item}>
                    <Text>检测更新</Text>
                    <Text>{this.updMsg()}</Text>
                </View>

                {this.showBtn2()}

                <View style={{padding:20}}>
                    {this.showBtn()}
                </View>
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
    },
})
