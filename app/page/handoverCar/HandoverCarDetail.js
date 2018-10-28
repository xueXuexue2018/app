import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    Platform,
    NativeModules
} from 'react-native';
import NavigatorBar from '../../components/NavgationBar';
import { Toast } from 'antd-mobile-rn';
import HttpUtil from "../../components/HttpUtil";
let Screen = require('Dimensions');
let viewW = Screen.get('window').width;//获取设备的宽度
export default class HandoverCarDetail extends Component{
    constructor(props){
        super(props);
        //状态
        this.state = {
            session:'',
            carData:'',
            address:'正在定位...',
            Mileage:null,//公里数
            src:'',
            htmlText:'拍   照',
            fielName:'',
            userName:''

        }

    };

    // static navigationOptions = ({ navigation }) => ({
    //     headerTitle:this.props.navigation.getParam('text'),
    //     headerTitleStyle:{color:'#fff',flex: 1,textAlign:'center'},
    //     headerStyle:{backgroundColor:'#028ce5'},
    //     headerRight:(
    //         <View style={{width:50}}></View>
    //     )
    // });

    componentDidMount(){
        //获取session
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({
                carData:this.props.navigation.state.params.nextData,
                session: ret,
                meetImage:ret.meetImage,
                returnImage:ret.returnImage,

            });
            this.getlocation();
            this.loadUserInfo();

        });
        //获取图片存放路径
        storage.load({
            key: 'imgUrl'
        }).then(ret => {
            this.setState({
                meetImage:ret.meetImage,
                returnImage:ret.returnImage
            });
        });





    }
    loadUserInfo(){
        let dataForm=new FormData();
        dataForm.append('session',this.state.session);

        HttpUtil.post('/carManage/phone/userInfo/findSelfUserInfo',dataForm)
            .then(result=>{
                if(result.code == 1){
                    let data = JSON.parse(result.content);
                    console.log(data.userName)
                    console.log(data)
                    this.setState({
                        userName:data[0].userName
                    })

                }else if(result.code == 2){
                    Toast.info(result.content,3);
                    this.setState({
                        isRefresh:false
                    })
                }else if(result.code == 3){
                    Toast.info(result.content,2);
                    this.setState({
                        isRefresh:false
                    })
                    this.props.navigation.navigate('Login');
                }else if(result.code == 4){
                    Toast.fail(result.content,3);
                    this.setState({
                        isRefresh:false
                    })
                }
            })
    }
    render(){{
         let  imgUrl=this.state.src;
         console.warn(imgUrl);
        return(
            <View style={styles.cantainer}>
                <NavigatorBar
                    title={this.props.navigation.state.params.text}
                    style={{
                        backgroundColor:'#028ce5'
                    }}
                    statusBar={{backgroundColor:'#03a2e5'}}
                    leftButton={
                        <TouchableOpacity
                            style={{padding: 8}}
                            onPress={()=>this.goBack()}
                        >
                            <Image style={styles.icon} source={require('../../res/img/back.png')}/>
                        </TouchableOpacity>
                    }
                />
                <View style={styles.tapManage}>
                    <Text style={styles.text}>{this.state.userName},当前选择的车辆为</Text>
                    <Text style={styles.textCorlo}>{this.state.carData.plateNumber}</Text>
                </View>
                <View style={styles.publicStyle}>
                    <Text style={styles.address}>地      点：</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入位置..."
                        underlineColorAndroid='transparent'
                        onChangeText={(text)=>this.state.address=text}
                        defaultValue={this.state.address}
                        multiline={true}
                    />
                    <TouchableOpacity onPress={() => this.getlocation()}>
                        <Image style={styles.imgWidth} source={require('../../res/img/qstd_dingwei_icon.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.publicStyle}>
                    <Text style={styles.lichen}>里 程 数：</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入里程数"
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                        multiline={true}
                        onChangeText={(text)=>this.state.Mileage=text}
                    />
                    <Text>Km</Text>
                </View>
                <Image style={styles.carmerImg} source={{uri:this.state.src.length>0?this.state.src:imgUrl}}/>
                <TouchableOpacity style={styles.btnView} activeOpacity={0.5} onPress={() => this.onclickFunction()}>
                    <Text style={styles.btn}>{this.state.htmlText}</Text>
                </TouchableOpacity>
            </View>

        )
    }}
    onclickFunction(){
        if (this.state.htmlText==='拍   照'){
            this.carmer();
        } else if (this.state.htmlText==='接车提交'){
            this.collectCarSubmit();
        } else if (this.state.htmlText==='交车提交') {
            this.returnCarSubmit();
        }
    }
    /*
    * 拍照
    * */
    carmer(){
        let fielName=this.state.carData.carId+'_'+new Date().getTime()+'.jpg';
        let codeY=null;
        let savePath=null;
        let html=null;
        let fileText=null;
        let downloadUrl=null;
        if (this.props.navigation.state.params.text=='接车') {
            codeY=0;savePath=this.state.meetImage;
            html='接车提交';
            fileText='meetImage';
            downloadUrl='downloadMmeetImage';
        }else {
            codeY=1;savePath=this.state.returnImage;
            html='交车提交';
            fileText='returnImage';
            downloadUrl='downloadReturnImage';
        }

        NativeModules.ImageCrop.selectWithCrop(fielName,savePath,this.state.session).then(result=>{
            console.warn(result);
            if (result==1){

                this.setState({
                    htmlText:html,
                    fielName:fielName,
                    src:'http://120.76.84.8:8080/carManage/phone/skipPage/'+downloadUrl+'?'+fileText+'='+fielName+'&session='+this.state.session,
                })


            }else {
                Toast.info('照片保存失败',2);
            }
        }).catch(e=>{

        })
    }
    /*
    * 返回上一个页面
    * **/
    goBack(){
        this.props.navigation.goBack();
    }
    //获取位置方法
    getlocation(){
        this.setState({
            address:'正在定位...'
        });
        NativeModules.ImageCrop.getLocation("location").then(result=>{console.warn(result);
            this.setState({
                address:result,
            })
        }).catch(e=>{
            this.setState({
                address:'定位失败',
            })
        })
    }

    //接车提交
    collectCarSubmit(){
        if (this.state.address==='定位失败'){
            Toast.info('请填写地点',2);
            return;
        }else if (!this.state.Mileage) {
            Toast.info('请填写里程数',2);
            return;
        }
        let dataForm=new FormData();
        dataForm.append('session',this.state.session);
        dataForm.append('meetPlace',this.state.address);
        dataForm.append('meetMileage',this.state.Mileage);
        dataForm.append('meetImage',this.state.fielName);
        dataForm.append('carId',this.state.carData.carId);
        dataForm.append('plateNumber',this.state.carData.plateNumber);
        HttpUtil.post('/carManage/phone/carTrans/meetCar',dataForm)
            .then(result=>{
                if(result.code == 1){
                    Toast.info(result.content,3);
                    //返回上一页面并刷新
                    this.props.navigation.state.params.calBack('no');
                    this.props.navigation.pop();
                }else if(result.code == 2){
                    Toast.info(result.content,3);
                    this.setState({
                        isRefresh:false
                    })
                }else if(result.code == 3){
                    Toast.info(result.content,2);
                    this.setState({
                        isRefresh:false
                    })
                    this.props.navigation.navigate('Login');
                }else if(result.code == 4){
                    Toast.fail(result.content,3);
                    this.setState({
                        isRefresh:false
                    })
                }
            })
    }
    //交车提交
     returnCarSubmit(){
        if (this.state.address==='定位失败'){
            Toast.info('请填写地点',2);
            return;
        }else if (!this.state.Mileage) {
            Toast.info('请填写里程数',2);
            return;
        }
        let dataForm=new FormData();
        dataForm.append('session',this.state.session);
        dataForm.append('returnPlace',this.state.address);
        dataForm.append('returnMileage',this.state.Mileage);
        dataForm.append('returnImage',this.state.fielName);
        HttpUtil.post('/carManage/phone/carTrans/returnCar',dataForm)
            .then(result=>{
                if(result.code == 1){
                    Toast.info(result.content,3);
                    this.props.navigation.state.params.calBack('no');
                    this.props.navigation.pop();
                }else if(result.code == 2){
                    Toast.info(result.content,3);
                    this.setState({
                        isRefresh:false
                    })
                    this.props.navigation.navigate('Login');
                }else if(result.code == 3){
                    Toast.info(result.content,2);
                    this.setState({
                        isRefresh:false
                    })
                }else if(result.code == 4){
                    Toast.fail(result.content,3);
                    this.setState({
                        isRefresh:false
                    })
                }
            })
    }
}
const styles=StyleSheet.create({
    cantainer:{
        flex:1,
    },
    tapManage:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingBottom:10,
        paddingTop:10,
        borderBottomColor:'#d5d5d5',
        borderStyle:'solid',
        borderBottomWidth:1

    },
    publicStyle:{
        flexDirection:'row',
        fontSize:10,
        borderBottomColor:'#d5d5d5',
        borderStyle:'solid',
        borderBottomWidth:1,
        alignItems:'center',
        paddingLeft:20,
        paddingRight:20
    },
    address:{
        width:'25%',
    },
    lichen:{
        width:'25%',
    },
    input:{
        width:'65%',
        height:'100%',
    },
    imgWidth:{
        width:25,
        height:35
    },
    textCorlo:{
        color:'#028ce5'
    },
    carmerImg:{
        width:'100%',
        height:viewW*2/3,
    },
    btnView:{
        marginTop:10,
        alignItems:'center',
        justifyContent:'center',
    },
    btn:{
        width:'60%',
        height: 40,
        color: '#fff',
        fontSize: 18,
        borderRadius: 5,
        backgroundColor: '#028ce5',
        lineHeight:35,
        textAlign:'center',
    },
    icon:{
        width:25,
        height:25,
        // marginLeft:10
    },
    height:{
        height:300
    }
})