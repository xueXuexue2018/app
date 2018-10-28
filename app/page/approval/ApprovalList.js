import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    RefreshControl,
    Image,
  DeviceEventEmitter
} from 'react-native';
import {

    Toast,
} from 'antd-mobile-rn';

import ApprovalDetails from './ApprovalDetails'

import NavgationBar from "../../components/NavgationBar";
import HttpUtil from "../../components/HttpUtil"
var ITEM_HEIGHT = 100;

const REQUEST_URL = '/carManage/phone/myApproval/findSelfWorkProcessReceiveInfoByParamsOfPage';
let pageNo = 0;//当前第几页
let itemNo=0;//item的个数

export default class ApprovalList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            dataSource:[],
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing:false,//下拉控制
            jobDesc:'',
            session: '',
            recordCount:0,


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

    componentDidMount(){
         DeviceEventEmitter.addListener('ApprovalList',()=>{
             pageNo=0;
             this.setState({
                 dataSource:[]
             })
             this.fetchData()
         });
    }
    componentWillUnmount(){
        DeviceEventEmitter.remove();
    }
    //网络请求——获取第pageNo页数据
    fetchData()
    {

        let fd = new FormData();
        fd.append("jobDesc",this.state.jobDesc);
        fd.append("recordCount",'0');
        fd.append("session",this.state.session);

        HttpUtil.post(REQUEST_URL,fd)
            .then(result=>{
                if(result.code == 1){

                    let data = JSON.parse(result.content);
                    if (data){
                        pageNo++;
                    }

                    let dataBlob = [];
                    let i = itemNo;

                    data.map(function (item) {
                        dataBlob.push({
                            key: i,
                            value: item,
                        })
                        i++;
                    });

                    itemNo = i;

                    let foot = 0;

                    if(!dataBlob||dataBlob.length==0||dataBlob==false){
                        foot = 1;//listView底部显示没有更多数据了
                    }

                    this.setState({
                        //复制数据源
                        dataSource:dataBlob,
                        isLoading: false,
                        showFoot:foot,
                        isRefreshing:false,
                    });
                    data = null;
                    dataBlob = null;

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
                    errorInfo: error,
                    isRefreshing:false,
                })
            })

        setTimeout(() => {
            this.setState({
                isRefreshing:false,
            })
        },1500)

    }



    render (){
        if (this.state.error) {
            //请求失败view
            return this.renderErrorView();
        }

        return this._renderFlatlist()
    }

    _renderFlatlist(){
        return(
                <View style={styles.container}>
                    <NavgationBar
                        title='我的审核'
                        statusBar={{
                            backgroundColor:'#028ce5'
                        }}
                        leftButton={
                            <TouchableOpacity style={{width:50}} onPress={()=>this.props.navigation.openDrawer()}>
                                <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/menu.png')}/>
                            </TouchableOpacity>
                        }
                    />

                    <View style={styles.headBgStyle}>
                        <TextInput 
                            style={styles.headInputBgStyle}
                            placeholder="请填写事项描述"
                            onChangeText={(text) => this.searchText(text)}

                            underlineColorAndroid= 'transparent'
                        />
                        <Text style={styles.searchButtonStyle} onPress={()=>this.searchAction()}>
                            搜索

                        </Text>
                    </View>

                    <View style={styles.listStyle}>

                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                            keyExtractor={(item, index) => item.id}
                            ListFooterComponent={this._renderFooter.bind(this)}
                            ItemSeparatorComponent={this._separator}
                            renderItem={this._renderItem.bind(this)}

                            onEndReached={this._onEndReached.bind(this)}
                            onEndReachedThreshold={1}
                            data={this.state.dataSource}>
                        </FlatList>
                    </View>

                </View>
            )

    }
    _onRefresh(){
        pageNo=0;
        this.setState({
            dataSource:[]
        })
        this.fetchData()

        setTimeout(() => {
            this.setState({

                isRefreshing:false,
            })
        },1500)
    }
//此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item.id;
    //每一行item
    _renderItem = ({item,index}) => {

        let reviewStatus=item.value.reviewStatus;

        if(reviewStatus == 1) {
            reviewStatus = "待审核"
        } else if(reviewStatus == 2) {
            reviewStatus = "已审批通过"
        } else if(reviewStatus == 3) {
            reviewStatus = "已审批不通过"
        } else if(reviewStatus == 4) {
            reviewStatus = "已取消"
        } else if(reviewStatus == 5) {
            reviewStatus = "已由他人置为通过"
        } else if(reviewStatus == 6) {
            reviewStatus = "已由他人置为不通过"
        }
        return <TouchableOpacity key={index} onPress={
            ()=>this.props.navigation.navigate('ApprovalDetails',
                {jobId:item.value.jobId,
                    workProcessInfoId:item.value.workProcessInfoId,
                    workInfoId:item.value.workInfoId,
                    reviewStatus:item.value.reviewStatus,
                    onCallback: ()=> {
                     pageNo=0;
                        this.setState({
                            dataSource:[]
                        })
                     this.fetchData();
                    }
                }
                )



        }>
            <View style={styles.listItemStyle}>
                <Text style={styles.txtStyle}>事项名称  {item.value.jobDesc} </Text>
                <Text style={styles.txtStyle}> 当前环节名称  {item.value.workProcessName}</Text>
                <Text style={item.value.reviewStatus===1?{textAlign:'right',marginRight:10,color:'#028ce5'}:{textAlign:'right',marginRight:10}}> 审核状态：  {reviewStatus}> </Text>
            </View>
        </TouchableOpacity>
    }

//分割线
    _separator = () => {
        return <View style={{height:2,backgroundColor:'#F5F5F5'}}/>;
    }
    //footer尾部视图
    _renderFooter(){
        if (this.state.showFoot === 1) {
            return (
                <View style={{height:30,alignItems:'center',justifyContent:'flex-start',}}>
                    <Text style={{color:'#999999',fontSize:14,marginTop:5,marginBottom:5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if(this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={styles.footer}>
                    <Text style={{height:40}}
                    onPress={()=>this.onLoad()}
                    >上拉加载更多</Text>
                </View>
            );
        }
    }
//加载更多
    onLoad(){

        var count=pageNo*15;
        let fd = new FormData();
        fd.append("jobDesc",this.state.jobDesc);
        fd.append("recordCount",count.toString());
        fd.append("session",this.state.session);

        HttpUtil.post(REQUEST_URL,fd)
            .then(result=>{
                if(result.code == 1){

                    let data = JSON.parse(result.content);

                     if (data){
                         pageNo++;
                     }

                    let dataBlob = [];
                    let i = 0;

                    data.map(function (item) {
                        dataBlob.push({
                            key: i,
                            value: item,
                        })
                        i++;
                    });

                    let foot = 0;

                    if(!dataBlob || dataBlob.length==0 || dataBlob==false){
                        foot = 1;//listView底部显示没有更多数据了
                    }

                    this.setState({
                        //复制数据源
                        dataSource:this.state.dataSource.concat(dataBlob),
                        isLoading: false,
                        showFoot:foot,
                        isRefreshing:false,
                    });

                    data = null;
                    dataBlob = null;

                }else if(result.code == 2){
                    Toast.info(result.content,2);
                }else if(result.code == 3){
                    Toast.fail(result.content,2);
                    this.props.navigation.navigate('Login');
                }else if(result.code == 4){
                    Toast.fail(result.content,2);
                }
            })


    }
//加载失败view
    renderErrorView() {
        return (
            <View style={styles.container}>
                <Text style={{marginTop:80}}>
                    加载失败
                </Text>
            </View>
        );
    }
    _onEndReached(){
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot != 0 ){
            return ;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if(this.state.showFoot==1){

            return;
        } else {

          this.onLoad()

        }
        // //底部显示正在加载更多数据
        // this.setState({showFoot:2});
        // //获取数据
        // this.fetchData();
    }
    searchText(text){

        this.setState({
            jobDesc:text
        })

    }
    //搜索
   searchAction(){
       pageNo=0;
       this.setState({
           dataSource:[]
       })
        this.fetchData()
   }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#F5F5F5',
        // backgroundColor:'#028ce5',
    },
    headBgStyleIOS:{
        width:'100%',
        height:40,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        marginBottom:10,
    },
    headInputBgStyleIOS:{
        flex:6,
        width:'70%',
        height:40,
        backgroundColor:'white',
        marginTop:10,
        marginLeft:30,
        justifyContent:'center',
        alignItems:'center'
    },
    searchButtonStyleIOS:{
        flex:2,
        backgroundColor:'#028ce5',
        marginLeft:20,
        marginTop:10,
        marginRight:20,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        textAlign:'center',
        color:'white',
        lineHeight:40,
        borderRadius: 6
    },
    //input和搜索底部的view
    headBgStyle:{
        width:'100%',
        height:40,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        marginBottom:10,


    },
    //input底部的view
    headInputBgStyle:{
        // flex:7,
        // height:40,
        // lineHeight:40,
        // backgroundColor: '#fff',
        // textAlign: 'center',
        // borderRadius: 6,
        // marginRight: 10,

        width:'70%',
        height:40,
        borderStyle:'solid',
        borderColor:'#d5d5d5',
        borderWidth:1,
        borderRadius:10,
        marginTop:10,
        marginLeft:10,
        marginBottom:20,
    },

    searchButtonStyle:{
        // flex:2,
        // height:40,
        // lineHeight:40,
        // backgroundColor:'#028ce5',
        // textAlign:'center',
        // color:'#fff',
        // borderRadius: 6
        width:'20%',
        height: 40,
        color: '#fff',
        fontSize: 16,
        borderRadius: 10,
        backgroundColor: '#028ce5',
        lineHeight:40,
        alignItems:'center',
        textAlign:'center',
        justifyContent:'center',
        marginLeft:10,
        marginTop:10,
        marginBottom:20,
    },
    listStyle:{
        flex:1,
        marginTop:10,
        backgroundColor:'#F5F5F5',
        marginBottom:0,
    },
    listItemStyle:{
        flex:1,
        backgroundColor:'white',
        height:ITEM_HEIGHT,
        justifyContent:'flex-start',
    },
    txtStyle:{
        marginLeft:10,
        marginBottom:20,
    },
});