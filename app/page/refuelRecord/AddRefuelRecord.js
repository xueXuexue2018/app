import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    NativeModules,
    WebView
} from 'react-native';
import { Button, Modal, Toast, Flex, Picker, List } from 'antd-mobile-rn';
import NavgationBar from "../../components/NavgationBar";
import HttpUtil from "../../components/HttpUtil";
import RefuelRecordList from "./RefuelRecordList";


export default class AddRefuelRecord extends Component{
    constructor(props) {
        super(props);
        this.state = {
            session: '',
            carId: this.props.navigation.state.params.carId,
            plateNumber: this.props.navigation.getParam('plateNumber'),//车牌号
            oilsImage: '',//图片保存路径
            selected: '92#',//油类型
            gasStation:'',//当前位置
            mileage:'',//里程数
            price:'',//单价
            oilNumber:'',//加油升数
            allPrice:'',//总价
            imgName: '',//图片名称
            src: '', //图片下载路径
        }
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret });
            //获取地理定位
            this.getLocation()
        })
        storage.load({
            key: 'imgUrl'
        }).then(ret => {
            this.setState({ oilsImage: ret.oilsImage });
        })
        
    }
    
    getPrice(text){
        this.setState({
            price:text,
            allPrice: text * this.state.oilNumber
        })
    }

    getOilNumber(text){
        this.setState({
            oilNumber:text,
            allPrice: text * this.state.price
        })
    }

    //检查大于等于0的整数或小数
    checkNumberOrFloat(value){
        let checkEl1 = /^[0-9]*[1-9][0-9]*$/;
        let checkEl2 = /^\+{0,1}\d+(\.\d{1,2})?$/;
        if((!(checkEl1.test(value))&&!checkEl2.test(value))||value<0){
            return false;
        }
        return true;
    }

    //获取位置
    getLocation() {
        this.setState({
            gasStation:'正在定位',
        })
        let s = NativeModules.ImageCrop.getLocation('ll').then(
            result=>{
                this.setState({
                    gasStation:result,
                })
            }).catch(e=>{
                Alert.alert('提示',e,[{text: '确认'}],{ cancelable: false })
            })
    }

    //拍照上传
    uplImg(){
        let imgName = this.state.carId+'_'+new Date().getTime()+'.jpg';
        let code = 2; //0, 接车拍照   1,交车拍照  2,加油拍照
        NativeModules.ImageCrop.selectWithCrop(imgName,this.state.oilsImage,this.state.session).then(
            result=>{

                if (result==1){
                    this.setState({
                        imgName:imgName,
                        src:'http://120.76.84.8:8080/carManage/phone/skipPage/downloadOilsImage?oilsImage='+imgName+'&session=' + this.state.session,
                    })
                }else {

                    Alert.alert('照片保存失败');
                }
            }).catch(e=>{
                Alert.alert('提示',e,[{text: '确认'}],{ cancelable: false })
            })
    }

    oilType(){
        Modal.alert('请选择油类型', <Text style={styles.findText}></Text>, [
                { text: '0#', onPress: () => this.setState({selected:'0#'}) },
                { text: '92#', onPress: () => this.setState({selected:'92#'}) },
                { text: '95#', onPress: () => this.setState({selected:'95#'}) },
                { text: '98#', onPress: () => this.setState({selected:'98#'}) },
            ])
    }
    
     //添加加油纪录
     addFormSbumit() {
        if(this.state.gasStation == "" || this.state.gasStation == null || this.state.gasStation == "undefined") {
            Toast.info("请填写加油站",1);
            return;
        }

        if(this.state.mileage == "" || this.state.mileage == null || this.state.mileage == "undefined") {
            Toast.info("请填写里程数",1);
            return;
        } else {
            let checkNumberMi = this.checkNumberOrFloat(this.state.mileage);
            if(!checkNumberMi) {
                Toast.info("请填写正确的里程数",1);
                return;
            }
        }

        if(this.state.selected == "" || this.state.selected == null || this.state.selected == "undefined") {
            Toast.info("请填写油类型",1);
            return;
        }

        if(this.state.price == "" || this.state.price  == null || this.state.price  == "undefined") {
            Toast.info("请填写单价",1);
            return;
        } else {
            let checkNumberPr = this.checkNumberOrFloat(this.state.price );
            if(!checkNumberPr) {
                Toast.info("请填写正确的单价",1);
                return;
            }
        }

        if(this.state.oilNumber == "" || this.state.oilNumber == null || this.state.oilNumber == "undefined") {
            Toast.info("请填写升量",1);
            return;
        } else {
            let checkNumberOi = this.checkNumberOrFloat(this.state.oilNumber);
            if(!checkNumberOi) {
                Toast.info("请填写正确的升量",1);
                return;
            }
        }
        let fd = new FormData();
        fd.append('session',this.state.session);
        fd.append('carId',this.state.carId);
        fd.append('gasStation',this.state.gasStation);
        fd.append('mileage',this.state.mileage);
        fd.append('price',this.state.price);
        fd.append('oilNumber',this.state.oilNumber);
        fd.append('oilsType',this.state.selected);
        fd.append('oilsImage',this.state.carId+'_'+new Date().getTime()+'.jpg');
        fd.append('plateNumber',this.state.plateNumber);
        fd.append('sumPrice',this.state.allPrice);



        HttpUtil.post('/carManage/phone/carOils/addCarOils',fd)
            .then(result=>{
                if(result.code == 1) {
                    Toast.info(result.content);
                    this.props.navigation.state.params.onCallback();
                    this.props.navigation.goBack();

                }else if(result.code == 2) {
                    Toast.info(result.content);
                }else if(data.code == 3) {
                    Toast.info(result.content);
                    this.props.navigation.navigate('Login');
                }else {
                    Toast.info(data.content);
                }
            })
            .catch(error=>{
                Toast.info('链接服务器失败，请检查网络',1);
            })
    }

    render() {
        let imgSrc = this.state.src ? {uri:this.state.src} : require('../../res/img/camera_icon.9.png');
        return (
            <View style={styles.container}>
                <NavgationBar
                    statusBar={{backgroundColor: '#028ce5'}}
                    title='添加加油记录'
                    leftButton={<TouchableOpacity style={{wdith:50,padding:10}} onPress={()=>this.props.navigation.goBack()}><Image style={{width:22,height:22,margin:5}} source={require('../../res/img/back.png')} /></TouchableOpacity>}
                />
                <Text style={styles.itemTop}>
                    当前车辆为：{this.state.plateNumber}
                </Text>
                <View style={styles.item}>
                    <Image style={styles.img} resizeMode='contain' source={require('../../res/img/qstd_oilbox_icon.png')}/>
                    <View style={styles.itemCenter}>
                        <Text style={styles.neededStyle}>*</Text>
                        <Text style={styles.label}>加油站：</Text>
                        <TextInput
                            style={styles.inputStyle}
                            placeholder="请输入位置..."
                            underlineColorAndroid='transparent'
                            onChangeText={(text)=>this.setState({
                                gasStation:text
                            })}
                            defaultValue={this.state.gasStation}
                            multiline={true}
                        />
                    </View>
                    <TouchableOpacity style={styles.itemRight} onPress={()=>this.getLocation()}>
                        <Image style={styles.img} resizeMode='contain' source={require('../../res/img/qstd_dingwei_icon.png')}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.item}>
                    <Image style={styles.img} resizeMode='contain' source={require('../../res/img/oil_table_icon.png')}/>
                    <View style={styles.itemCenter}>
                        <Text style={styles.neededStyle}>*</Text>
                        <Text style={styles.label}>里程数：</Text>
                        <TextInput 
                            onChangeText={(text)=>this.setState({mileage:text})}//输入框改变触发的函数
                            style={styles.inputStyle}
                            underlineColorAndroid= 'transparent'
                            keyboardType = 'numeric'
                        />
                    </View>
                    <TouchableOpacity style={styles.itemRight} onPress={()=>this.uplImg()}>
                        <Image style={styles.img} resizeMode='contain' source={imgSrc}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.item}>
                    <Image style={styles.img} resizeMode='contain' source={require('../../res/img/oqstd_oiltype_icon.png')}/>
                    <View style={styles.itemCenter}>
                        <Text style={styles.neededStyle}>*</Text>
                        <Text style={styles.label}>油类型：</Text>
                        <Text style={{flex:1,color:'#000',lineHeight:50,paddingLeft:10}}>{this.state.selected}</Text>
                    </View>
                    <TouchableOpacity style={styles.itemRight} onPress={()=>this.oilType()}>
                        <Image style={styles.img} resizeMode='contain' source={require('../../res/img/qstd_enter.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.item}>
                    <Image style={styles.img} resizeMode='contain' source={require('../../res/img/qstd_danjia_icon.png')}/>
                    <View style={styles.itemCenter}>
                        <Text style={styles.neededStyle}>*</Text>
                        <Text style={styles.label}>单&nbsp;&nbsp;&nbsp;&nbsp;价：</Text>
                        <TextInput 
                            onChangeText={(text)=>this.getPrice(text)}//输入框改变触发的函数
                            style={styles.inputStyle}
                            underlineColorAndroid= 'transparent'
                            keyboardType = 'numeric'
                        /> 
                    </View>
                    <View style={styles.itemRight}>
                        <Text>￥/L</Text>
                    </View>
                </View>
                <View style={styles.item}>
                    <Image style={styles.img} resizeMode='contain' source={require('../../res/img/qstd_oilnum_icon.png')}/>
                    <View style={styles.itemCenter}>
                        <Text style={styles.neededStyle}>*</Text>
                        <Text style={styles.label}>升&nbsp;&nbsp;&nbsp;&nbsp;量：</Text>
                        <TextInput 
                            onChangeText={(text)=>this.getOilNumber(text)}//输入框改变触发的函数
                            style={styles.inputStyle}
                            underlineColorAndroid= 'transparent'
                            keyboardType = 'numeric'
                        /> 
                    </View>
                    <View style={styles.itemRight}>
                        <Text>L</Text>
                    </View>
                </View>
                <View style={styles.item}>
                    <Image style={styles.img} resizeMode='contain' source={require('../../res/img/qstd_allmoney_icon.png')}/>
                    <View style={styles.itemCenter}>
                        <Text style={styles.label}>总&nbsp;&nbsp;&nbsp;&nbsp;价：</Text>
                        <Text style={{flex:1,color:'#000',lineHeight:50,paddingLeft:10}}>{this.state.allPrice?this.state.allPrice:''}</Text>
                    </View>
                    <View style={styles.itemRight}>
                        <Text>￥</Text>
                    </View>
                </View>
                <View style={{padding:10}}>
                    <Button type="primary" onClick={()=>this.addFormSbumit()}>添加</Button>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    itemTop:{
        backgroundColor:'#f4f4f4',
        height:40,
        lineHeight:40,
        paddingLeft:10
    },
    item:{
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    inputBox:{
        flexDirection: 'row',
    },
    img:{
        width: 40,
        height:40
    },
    itemCenter:{
        flex: 1,
        flexDirection: 'row',
    },
    inputStyle:{
        flex: 1,
    },
    label:{
        height:50,
        lineHeight:50,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 16,
    },
    itemRight:{
        width:50,
        height:50,
        borderLeftColor: '#ccc',
        borderLeftWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webView:{
        position: 'absolute',
        zIndex:1,
        flex: 1,
    },
    addBtStyle: {
        backgroundColor:'#028ce5',
        width:'70%',
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        textAlign:'center',
        lineHeight:40,

    },
    neededStyle: {
        color:'red',
        lineHeight:50,
        paddingLeft:2
    }
})