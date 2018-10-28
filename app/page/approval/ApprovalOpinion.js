import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    Image,
  DeviceEventEmitter
} from 'react-native'
import {
    Checkbox,
    Toast,
} from 'antd-mobile-rn';

import NavgationBar from "../../components/NavgationBar";
import HttpUtil from "../../components/HttpUtil";

const CheckboxItem = Checkbox.CheckboxItem;


const REQUEST_URL = '/carManage/phone/myApproval/findNextWorkProcessInfoUserInfo';
export default class ApprovalOpinion extends Component{
    static navigationOptions = {
        title: '填写审核意见',
    };
    constructor(props) {
        super(props);
        this.state = {
            jobId: this.props.navigation.state.params.jobId,
            session: '',
            workInfoId:this.props.navigation.state.params.workInfoId,
            workProcessInfoId:this.props.navigation.state.params.workProcessInfoId,
            dataSource:[],
            userData:[],
            error: false,
            errorInfo: '',
            isShowSendBack:false,//是否显示回退按钮
             opinionInfo:'',
            checkDic:'',
            viewNumber:0,
            flag:'',
            checkedNum:0,//选中的人数
            sortOrder:'',
            nextInfo:[],//下一环节的信息
        }
        //获取session
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret })

            //请求数据
            this.fetchData();
        })
    }


    fetchData(){
        this.findNowWorkProcessInfoByJobId();
        this.judgeSendBack();
        this.findNextWorkProcessInfoUserInfo();
    }

    //移动端根据事项id查找当前工作流程信息
    findNowWorkProcessInfoByJobId(){
        let fd = new FormData();
        fd.append("jobId",this.state.jobId);
        fd.append("session",this.state.session);

        HttpUtil.post('/carManage/phone/myApproval/findNowWorkProcessInfoByJobId',fd)
            .then(result=>{
                if(result.code == 1){
                    //
                    let data =JSON.parse(result.content) ;
                    this.setState({
                        dataSource: data,
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
                this.setState({
                    error: true,
                    errorInfo: error
                })
                Toast.info('连接服务器失败，请检查网络',1);
            })
    }
    //移动端根据工作流程id查找下一环节的信息和人员
    findNextWorkProcessInfoUserInfo(){
        let fd = new FormData();
        fd.append("workProcessInfoId",this.state.workProcessInfoId);
        fd.append("workInfoId",this.state.workInfoId);
        fd.append("jobId",this.state.jobId);
        fd.append("session",this.state.session);

        HttpUtil.post(REQUEST_URL,fd)
            .then(result=>{
                if(result.code == 1){

                    let data =JSON.parse(result.content) ;
                    let note=JSON.parse(result.note);
                    let dataBlob = [];
                    let i = 0;
                    let check={};

                    data.map(function (item) {
                        dataBlob.push({
                            key: i,
                            value: item,
                        })

                        i++;
                    });
                    for (let k=0;k<dataBlob.length;k++){
                        check[k]=false;
                    }


                    this.setState({
                        userData: dataBlob,
                        checkDic:check,
                        viewNumber:Number(note['viewNumber']),
                        flag:data.flag,
                        sortOrder:Number(note['sortOrder']),
                        nextInfo:note,
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
                this.setState({
                    error: true,
                    errorInfo: error
                })
            })
    }
    //判断是否显示回退按钮
    judgeSendBack(){
        let fd = new FormData();
        fd.append("session",this.state.session);
        fd.append("workProcessInfoId",this.state.workProcessInfoId);


        HttpUtil.post('/carManage/phone/myApproval/findIsReturnByWorkProcessInfoId',fd)
            .then(result=>{
                if(result.code == 1){
                    let dataContent =JSON.parse(result.content) ;
                    if(dataContent == 1) { //1.是
                       this.setState({
                           isShowSendBack:true
                       })
                    } else if(dataContent == 2) { //否
                        this.setState({
                            isShowSendBack:false
                        })
                    }
                }else if(result.code == 2){
                     Toast.info(result.content);
                }else if(result.code == 3){
                    Toast.info(result.content);
                }else if(result.code == 4){
                    Toast.info(result.content);
                }
            })
            .catch(error=>{
                this.setState({
                    error: true,
                    errorInfo: error
                })
                Toast.info('连接服务器失败，请检查网络',1);
            })
    }
    render(){
        return (

            <View style={styles.container}>
                <NavgationBar
                    title='填写审核意见'
                    statusBar={{
                        backgroundColor: '#028ce5'
                    }}
                    leftButton={
                        <TouchableOpacity onPress={ ()=>{
                           this.props.navigation.pop();
                            this.props.navigation.state.params.onCallback();
                        }
                        }>
                            <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/back.png')}/>
                        </TouchableOpacity>
                    }
                />

                <View style={styles.listStyle}>
                    <FlatList
                        ItemSeparatorComponent={this._separator}
                        renderItem={this._renderItem.bind(this)}
                        keyExtractor={this._keyExtractor}

                        data={this.state.userData}>
                    </FlatList>
                </View>
                {this.renderViewNum()}
            </View>

        )
    }
    //分割线
    _separator = () => {
        return <View style={{height:2,backgroundColor:'#F5F5F5'}}/>;
    }
    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item.key;
    _renderItem({item,index}){
        return <View style={styles.listItemStyle}>
            <CheckboxItem key={index}
                          onChange={()=>  this.onChange(index)}

            >{item.value.processReceiveObjectName}</CheckboxItem>

        </View>
    }
    // 是否显示至少 需要会签人员数量
    renderViewNum(){
        if (this.state.viewNumber>0){
            return   <View style={styles.bottomStyle}>
                <Text style={{marginBottom:10,marginTop:20}}>流转人员(下一环节至少需要1人会签)</Text>
                <TextInput
                    style={{width:'80%',
                        borderStyle:'solid',
                        borderColor:'#d5d5d5',
                        borderWidth:1,
                        borderRadius:10,
                        backgroundColor:'white',
                        height:100,
                        marginTop:40,
                        marginBottom:20,
                    }}
                    underlineColorAndroid= 'transparent'
                    placeholder="请填写审核意见"
                    onChangeText={(text) => this.setState({
                        opinionInfo:text
                    })}

                />
                <View style={styles.buttonStyle}>

                    <Text style={styles.sendBack}
                          onPress={()=>this._sendBack()}
                    >{this.state.isShowSendBack?'回退':''}</Text>
                    <Text style={styles.agree}
                          onPress={()=>this.agreeAndDisagree('1',true)}
                    >同意</Text>
                    <Text style={styles.disagree}
                          onPress={()=>this.agreeAndDisagree('2',true)}
                    >不同意</Text>
                </View>

            </View>
        }else {
         return  <View style={styles.bottomStyle}>

                <TextInput
                    style={{width:'80%',
                        borderStyle:'solid',
                        borderColor:'#d5d5d5',
                        borderWidth:1,
                        borderRadius:10,
                        backgroundColor:'white',
                        height:100,
                        marginTop:40,
                        marginBottom:20,
                    }}
                    placeholder="请填写审核意见"
                    onChangeText={(text) => this.setState({
                        opinionInfo:text
                    })}
                    value={this.state.opinionInfo}
                    underlineColorAndroid= 'transparent'
                />
                <View style={styles.buttonStyle}>

                    <Text style={styles.sendBack}
                          onPress={()=>this._sendBack()}
                    >{this.state.isShowSendBack?'退回':''}</Text>
                    <Text style={styles.agree}
                          onPress={()=>this.agreeAndDisagree('1',false)}

                    >同意</Text>
                    <Text style={styles.disagree}
                          onPress={()=>this.agreeAndDisagree('2',false)}
                    >不同意</Text>
                </View>

            </View>
        }

    }
    //退回
    _sendBack(){
        var contents=this.state.dataSource;
        var sortOrder=contents.sortOrder;
        let fd = new FormData();
        fd.append("session",this.state.session);
        fd.append("jobId",this.state.jobId);
        fd.append("viewInfo",this.state.opinionInfo);
        fd.append("result",'3');
        fd.append("sortOrder",sortOrder);
        fd.append("workInfoId",this.state.workInfoId);
        fd.append("workName",contents.workName);
        fd.append("workProcessInfoId",this.state.workProcessInfoId);
        fd.append("workProcessName",contents.workProcessName);
        HttpUtil.post('/carManage/phone/myApproval/returnApprovel',fd)
            .then(result=>{
                if(result.code == 1){
                    Alert.alert('提交成功','',
                        [{text:"确定", onPress:()=>
                            {
                                this.props.navigation.pop(2);

                               DeviceEventEmitter.emit('ApprovalList');
                            }
                        }]
                    );

                }else if(result.code == 2){
                    Toast.info(result.content);
                }else if(result.code == 3){
                    Toast.info(result.content);
                    this.props.navigation.navigate('Login');
                }else if(result.code == 4){
                    Toast.info(result.content);
                }
            })
            .catch(error=>{
                this.setState({
                    error: true,
                    errorInfo: error
                })
                Toast.info('连接服务器失败，请检查网络',1);
            })
    }
    //type:1同意 2不同意
    agreeAndDisagree(type,isNeed){

        if (isNeed){
    if (this.state.checkedNum==0 ){
        Toast.info('请勾选流转人员 !！！', 1);
        return;
    }else if(this.state.checkedNum < this.state.viewNumber && this.state.viewNumber > 0) {

        Toast.info('下一环节至少需要'+this.state.viewNumber+'人会签！', 1);

        return;
    }
    }

        var contents=this.state.dataSource;
        var workInfoId =contents.workInfoId;
        var workName = contents.workName;
        //var workProcessInfoId = contents("workProcessInfoId");
        var workProcessInfoId = contents.workProcessInfoId;
        var workProcessName = contents.workProcessName;
        //流程排序
        var sortOrder = contents.sortOrder;

        let fd = new FormData();
        fd.append("session",this.state.session);
        fd.append("jobId",this.state.jobId);
        fd.append("viewInfo",this.state.opinionInfo);
        fd.append("result",type);
        fd.append("sortOrder",sortOrder);
        fd.append("workInfoId",workInfoId);
        fd.append("workName",workName);
        fd.append("workProcessInfoId",workProcessInfoId);
        fd.append("workProcessName",workProcessName);


        HttpUtil.post('/carManage/phone/myApproval/addWorkView',fd)
            .then(result=>{

                if(result.code == 1){
                    //如果下一个环节有人员
                    if(type==1 && this.state.checkedNum>0&& isNeed &this.state.checkedNum>=this.state.viewNumber){

                       this.batchAddWorkProcessReceiveInfo(isNeed);

                    }else {

                        Alert.alert('提交成功','',
                            [{text:"确定", onPress:()=>
                                {this.props.navigation.pop(2);

                                    DeviceEventEmitter.emit('ApprovalList');
                                }
                            }]
                        );

                    }

                }else if(result.code == 2){
                    Toast.info(result.content);
                }else if(result.code == 3){
                    Toast.info(result.content);
                    this.props.navigation.navigate('Login');
                }else if(result.code == 4){
                    Toast.info(result.content);
                }
            })
            .catch(error=>{
                this.setState({
                    error: true,
                    errorInfo: error
                })
                Toast.info('连接服务器失败，请检查网络',1);
            })
    }



    //提交流转人员
    batchAddWorkProcessReceiveInfo(isNeed){
        var contents=this.state.dataSource;
        var workInfoId =contents.workInfoId;
        var workName = contents.workName;

        var workProcessInfoId = contents.workProcessInfoId;
        var workProcessName = contents.workProcessName;
        //流程排序
        var sortOrder = this.state.sortOrder;
        var jobDesc = contents.jobDesc;

        var userIdStringInfo = '';
        var userNameStringInfo = '';


        if(this.state.checkedNum > 0 && isNeed) {
            for (let key in this.state.checkDic) {
                var nn = key.toString()
                if (this.state.checkDic[nn]) {

                    var mm = this.state.checkDic[nn]
                    //这里找到用户点击了哪个
                    var userDic = this.state.userData[key];
                    var userIdString = userDic.value.processReceiveObjectId; //提交的ID
                    var userNameString = userDic.value.processReceiveObjectName;
                    userIdStringInfo=userIdStringInfo + ',' + userIdString;
                    userNameStringInfo=userNameStringInfo+','+userNameString;
                }
            }
        }else {

            return;
        }
        let fd = new FormData();
        fd.append("session",this.state.session);
        fd.append("jobId",this.state.jobId);
        fd.append("jobDesc",jobDesc);
        fd.append("sortOrder",sortOrder);
        fd.append("workInfoId",workInfoId);
        fd.append("workName",workName);
        fd.append("workProcessInfoId",this.state.nextInfo.workProcessInfoId);
        fd.append("workProcessName",this.state.nextInfo.workProcessName);
        fd.append("userIdString",userIdStringInfo);
        fd.append("userNameString",userNameStringInfo);


        HttpUtil.post('/carManage/phone/myApproval/batchAddWorkProcessReceiveInfo',fd)
            .then(result=>{

                if(result.code == 1){


                    Alert.alert('提交成功','',
                        [{text:"确定", onPress:()=>
                            {this.props.navigation.pop(2);
                                DeviceEventEmitter.emit('ApprovalList');

                            }
                        }]
                    );

                }else if(result.code == 2){
                    Toast.info(result.content);
                }else if(result.code == 3){
                    Toast.info(result.content);
                    this.props.navigation.navigate('Login');
                }else if(result.code == 4){
                    Toast.info(result.content);
                }else {
                    Toast.info(result.content);
                }
            })
            .catch(error=>{
                this.setState({
                    error: true,
                    errorInfo: error
                })
                Toast.info('连接服务器失败，请检查网络',1);
            })
    }
    onChange(val) {

         var kk=val.toString();
        let checkedNum=  this.state.checkedNum;
           var ss=this.state.checkDic[kk];
           if (ss==true){
               //未选中
               this.state.checkDic[kk]=false;

               checkedNum>0?checkedNum--:0;
               this.setState({
                   checkedNum:checkedNum
               });
           } else {
               //选中
               this.state.checkDic[kk]=true;
               this.setState({
                   checkedNum:checkedNum+1
               });

           }


    }


    }
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#F5F5F5',
    },
    backBar:{
        marginLeft:20,
        color:'white',
        fontSize:20
    },
    listStyle:{

        marginTop:10,
        backgroundColor:'white',
        marginBottom:0,
    },
    listItemStyle:{
        backgroundColor:'white',
        height:50,
        justifyContent:'flex-start',
    },
    txtStyle:{
        marginLeft:10,
        marginBottom:20,
    },
    bottomStyle:{
        width:'100%',
        backgroundColor:'#028ce5',
        position:'absolute',
        bottom:0,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonStyle:{
        width:'80%',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        height:60,
    },
    sendBack:{
        flex:4,
        backgroundColor:'#FFCD00',
        textAlign:'center',
        height:30,
        lineHeight:30,
        borderRadius:10,
        color:'#fff'
    },
    agree:{
        flex:4,
        backgroundColor:'#3700FF',
        height:30,
        lineHeight:30,
        textAlign:'center',
        marginLeft:20,
        color:'#fff',
        borderRadius:10
    },
    disagree:{
       flex:4,
        backgroundColor:'#FF6100',
        height:30,
        lineHeight:30,
        textAlign:'center',
        marginLeft:20,
        borderRadius:10,
        color:'#fff'
    }



})