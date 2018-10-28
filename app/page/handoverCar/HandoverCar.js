import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ActivityIndicator,
    FlatList,
    Button,
    TextInput,
} from 'react-native';
import HttpUtil from '../../components/HttpUtil';
import { Toast } from 'antd-mobile-rn';
import NavigatorBar from '../../components/NavgationBar';
//屏幕信息
const dimensions = require('Dimensions');
//获取屏幕的宽度和高度
const {width, height} = dimensions.get('window');
export default class HandoverCar extends Component{
    constructor(props){
        super(props);
        //当前页
        this.page = 1;
        //状态
        this.state = {
            session: '',
            data:[],// 列表数据结构
            showHeater:0,//0：隐藏heater,1：加载中
            seachText:'',//搜索关键字
            selectData:'',//接车的数据
            note:false,
            textHtml:'接车',
            row:'no',//当前选中的行
            isRefresh:true,//是否显示loading
            showFoot:0,// 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        }

    }
    //渲染render之前调用
    componentDidMount(){
        //获取session
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret});
            this._userIsMeet();//查询用户是否接车
            this._getHotList();//获取车辆信息
        });
    }

    //查询用户是否接车
    _userIsMeet(){
        let dataT=new FormData();
        dataT.append("session",this.state.session);
        HttpUtil.post('/carManage/phone/carTrans/checkIsmeet',dataT)
            .then(result=>{
                if(result.code == 1){
                    if(result.note == 1){//已接车
                        let con=JSON.parse(result.content);
                        this.setState({
                            selectData:con,
                            note:true,
                            textHtml:'交车'
                        });
                    }else {//未接车
                        this.setState({
                            selectData:'',
                            note:false,
                            textHtml:'接车'
                        });
                    }
                }else if(result.code == 2){
                    Toast.info(result.content,3);
                }else if(result.code == 3){
                    Toast.info(result.content,2);
                    this.props.navigation.navigate('Login');
                }else if(result.code == 4){
                    Toast.fail(result.content,3);
                }
        })
    }

    //获取车辆列表
    _getHotList() {
        let dataT=new FormData();
        dataT.append("session",this.state.session);
        dataT.append("username",this.state.seachText);
        HttpUtil.post('/carManage/phone/carInfo/getAllCarInfo',dataT)
            .then(result=>{
                if(result.code == 1){
                    let con=JSON.parse(result.content);
                    if(con.length>0){
                        if(this.page === 1){
                            this.setState({
                                data: con,
                                isRefresh:false
                            })
                        }else{
                            this.setState({
                                // 数据源刷新 add
                                data: this.state.data.concat(con),
                                showFoot:0
                            })
                        }
                    }else {
                        this.setState({
                            // 数据源刷新 add
                            data: [],
                            showFoot:2
                        })
                    }

                }else if(result.code == 2){
                    Toast.info(result.content,3);
                    this.setState({
                        isRefresh:false
                    })
                }else if(result.code == 3){
                    Toast.info(result.content,2);
                    this.setState({
                        isRefresh:false
                    }) ;
                    this.props.navigation.navigate('Login');
                }else if(result.code == 4){
                    Toast.fail(result.content,3);
                    this.setState({
                        isRefresh:false
                    })
                }
            })
    }

    //搜索
    getLoginText(text){
        this.setState({
            seachText:text
        })
    }
    //点击搜索
    seachFind(){
        this.page = 1;
        this.setState({
            row:'no',
            // selectData:'',//接车的数据
        });
        this._getHotList();//查询车辆信息
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'交接车'}
                    statusBar={{backgroundColor:'#028ce5'}}
                    leftButton={
                        <TouchableOpacity style={{width:50}} onPress={()=>this.props.navigation.openDrawer()}>
                            <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/menu.png')} />
                        </TouchableOpacity>
                    }
                />
                <View style={styles.seach}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text)=>this.getLoginText(text)}//输入框改变触发的函数
                        placeholder="请输入车牌号"
                        underlineColorAndroid='transparent'
                    />
                    <TouchableOpacity style={styles.seachTou} activeOpacity={0.5} onPress={() => this.seachFind()}>
                        <Text style={styles.seachText}>搜索</Text>
                    </TouchableOpacity>

                </View>
                <FlatList
                    //数据源
                    data={this.state.data}
                    //item显示的布局
                    renderItem={({item,index}) => this._createListItem(item,index)}
                    //每行唯一的key值
                    keyExtractor={(item,index) => index}
                    //下拉刷新相关
                    onRefresh={() => this._onRefresh()}
                    refreshing={this.state.isRefresh}
                />
                {this.state.note?
                    <View style={styles.positionBottom}>
                        <TouchableOpacity style={[styles.touch,{width:'100%'}]} activeOpacity={0.5} onPress={() => this.handCar()}>
                            <Text style={[styles.handCar]}>交车</Text>
                        </TouchableOpacity>
                    </View>:
                    <View style={styles.positionBottom}>
                        <TouchableOpacity style={styles.touch} activeOpacity={0.5} onPress={() => this.handCar()}>
                            <Text style={[styles.handCar]}>接车</Text>
                        </TouchableOpacity>
                        <Text style={styles.borderRight}></Text>
                        <TouchableOpacity style={styles.touch} activeOpacity={0.5} onPress={() => this.passe()}>
                            <Text style={styles.handCar}>跳过</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }

    //创建每行布局
    _createListItem(item,index){
        let ImgSrc=null;
        let bgColor='';
        let html='';
        let jieColor='';
        if (item.isMeet==1){//已接车
            ImgSrc=require('../../res/img/qstd_icon_jie.png');
            html='--'+item.userName;//接车人
            jieColor=styles.selectColorBlue;
        }else {//未接车
            ImgSrc=this.state.row==index?require('../../res/img/select.png'):require('../../res/img/check_false.png');
            bgColor=this.state.row==index?styles.listSelectBg:'';
        }
        return (
            <TouchableHighlight underlayColor='#c0d5e5' onPress={() => this._onItemClick(item,index)}>
                <View ref='ref_view' style={[styles.listFiex,bgColor]}>
                    <View style={styles.text_left}>
                        <Image  source={ImgSrc} style={[styles.itemImages]}/>
                        <Text style={[styles.text_Style,jieColor]}>{item.plateNumber}{html}</Text>
                    </View>
                    <View style={styles.text_right}>
                        <Text style={{color:"#028ce5"}}>{item.jobCount}</Text>
                        <Text>项任务</Text>
                        <Image style={[styles.itemImages,{tintColor:'#b4b4b4',}]} source={require('../../res/img/right_d.png')}/>
                    </View>

                </View>
            </TouchableHighlight>
        );
    }

    // 下拉刷新
    _createEmptyView(){
        return (
            <View style={{height:'100%', alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:16}}>
                    暂无列表数据，下拉刷新
                </Text>
            </View>
        );
    }

    //下拉刷新
    _onRefresh=()=>{
        // 不处于 下拉刷新
        if(!this.state.isRefresh){
            this.setState({
                isRefresh:true
            });
            this.page = 1;
            this._getHotList();
        }
    };

    //item点击事件
    _onItemClick(item,index){
        //未接车
        if(!this.state.note && item.isMeet!=1){
            this.setState({
                selectData:item,
                row:index
            })
        }else {//已接车
            if (item.carId===this.state.selectData.carId&&item.jobCount!==0){
                this.props.navigation.navigate('TaskDetails',{nextData:item});
            }
        }
    }

    // 点击交接车
    handCar(){
        if(this.state.selectData){
            //跳转到下一个页面，传参数为nextData
            this.props.navigation.navigate(
                'HandoverCarDetail',
                {
                    nextData:this.state.selectData,text:this.state.textHtml,
                    calBack:(row)=>{
                        this.page=1;
                        this.setState({
                            row:row,
                        });
                        this._getHotList();//查询车辆列表
                        this._userIsMeet();//查询用户是否接车
                    }
                }
                );
        }else {
            Toast.info('请选择车辆！',2);
        }
    }

    //点击跳过
    passe(){
        this.props.navigation.navigate('CurrentTaskRoot')
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headView:{
        width:width,
        height:100,
        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center'
    },
    footerView:{
        width:width,
        height:100,
        backgroundColor:'yellow',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute'
    },
    itemImages:{
        width:25,
        height:25,
        resizeMode:'stretch',

    },
    listFiex:{
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,
        flexDirection:'row',
        justifyContent:'space-between',
        borderBottomColor:'#d5d5d5',
        borderStyle:'solid',
        borderBottomWidth:1
    },
    text_Style:{
        paddingLeft:15,
        flexWrap:'wrap',
        // boxSizing:'border-box'
    },
    footer:{
        flexDirection:'row',
        height:24,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
    },
    positionBottom:{
        flexDirection:'row',
        borderTopColor:'#d5d5d5',
        borderStyle:'solid',
        borderTopWidth:1,
        justifyContent:'space-around',
        alignItems:'center',
        backgroundColor:'#ddd',
    },
    handCar:{
        height:50,
        fontSize:18,
        lineHeight:40,
        color:'#028ce5',

    },
    borderRight:{
        height:40,
        width:2,
        backgroundColor:'#808080'
    },
    touch:{
        width:'50%',
        alignItems:'center',
        justifyContent:'center'
    },
    seach:{
        flexDirection:'row',
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,
        borderBottomColor:'#d5d5d5',
        borderStyle:'solid',
        borderBottomWidth:1,
    },
    input:{
        width:'70%',
        height:40,
        borderStyle:'solid',
        borderColor:'#d5d5d5',
        borderWidth:1,
        borderRadius:10
    },
    seachTou:{
        width:'30%',
    },
    seachText:{
        width:'80%',
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
    },
    selectColorBlue:{
        color:"#028ce5",
    },
    text_right:{
        flexDirection:'row',
        // textAlign:'right',
        justifyContent:'center',
        alignItems:'center'
    },
    text_left:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    listSelectBg:{
        backgroundColor:'#c0d5e5'
    }
});