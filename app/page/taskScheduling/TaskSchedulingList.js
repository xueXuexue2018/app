import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Image
} from 'react-native';
import{
    Accordion, List,// 手风琴
    SearchBar, Button, WhiteSpace, WingBlank,// 查询
    Flex,Toast,
    Picker
} from 'antd-mobile-rn';
import HttpUtil from '../../components/HttpUtil';
import Tool from '../../components/Tool';
import NavgationBar from '../../components/NavgationBar';

var ITEM_HEIGHT = 100;
const Item = List.Item;
const FItem = Flex.Item;

export default class ApprovalList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            session: '',
            list:[],
            type:1,// type-请求类型 （  1表示获取最新，2表示加载更多，）
            carType: '0',//用车类型
            selectPlace:'', //过滤地点
            selectDate: Tool.formate(new Date()),//用车日期
            updateTime:0,//最后更新时间
            isRefresh: true,//是否显示loading
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        }
    }

    //渲染render之前调用
    componentDidMount(){
        //获取session
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret });
            this.findTodayDispathCarTask(0);//任务调度列表
        })
    }
  
    //任务调度列表
    findTodayDispathCarTask(count){
        let data = new FormData();
        data.append("session",this.state.session);
        data.append("type",count>0?2:1);//type-请求类型 （  1表示获取最新，2表示加载更多，）
        data.append("carType", this.state.carType);//用车类型
        data.append("selectPlace",this.state.selectPlace);//过滤地点
        data.append("selectDate",this.state.selectDate);//用车日期
        data.append("updateTime",this.state.updateTime);//最后更新时间
        data.append("recordCount",count);//当前列表记录条数（第一次传0）
        HttpUtil.post('/carManage/phone/carTaskDispath/findTodayDispathCarTask',data)
            // .then(()=>Toast.loading('Loading...',0))
            .then(result=>{
                this.setState({isRefresh:false});
                if(result.code == 1){
                    let d = JSON.parse(result.content);
                    if(d.length>0){
                        if (count>0){
                            this.setState({
                                list:this.state.list.concat(d),
                                // recordCount:this.state.recordCount+d.length,
                                showFoot:0
                            })
                        } else{
                            this.setState({
                                list:d,
                                // recordCount:this.state.recordCount+d.length,
                                showFoot:0
                            })
                        }

                    }else{
                        this.setState({
                            showFoot:1
                        })
                    }
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
                Toast.success('请求失败', 2);
                this.setState({isRefresh:false});
            })
    }

    //下拉刷新
    _onRefresh=()=>{
        if(!this.state.isRefresh){
            this.setState({
                isRefresh:true
            })
            this.findTodayDispathCarTask(0);
        }
    }

    //上拉加载更多
    _onLoadMore(){
        if(this.state.showFoot != 0 ){
            return
        }
        //底部显示正在加载更多数据
        this.setState({showFoot:2});
        //获取数据
        this.findTodayDispathCarTask(this.state.list.length)
    }

    //底部加载更多
    renderFooter(){
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
                    <Text></Text>
                </View>
            );
        }
    }

    //不同状态展示的操作按钮
    buttons(s,jobId){
        if(s == 1){
            return(
                <Flex>
                    <FItem style={[styles.listFItem]}>
                        <Button type="primary"
                                onClick={()=>this.props.navigation.navigate('TaskScheduling',{tp:1,jobId:jobId,
                                    callback: ()=>{
                                            this.findTodayDispathCarTask(0);
                                        }
                                })}
                        >派车</Button>
                    </FItem>
                    <FItem style={[styles.listFItem]}>
                        <Button type="warning"
                                onClick={()=>this.props.navigation.navigate('TaskScheduling',{tp:2,jobId:jobId,
                                    callback: ()=>{
                                        this.findTodayDispathCarTask(0);
                                    }
                                })}
                        >取消</Button>
                    </FItem>
                </Flex>
            )
        }else{
            return(
                <Flex>
                    <FItem style={[styles.listFItem]}>
                        <Button type="primary"
                                onClick={()=>this.props.navigation.navigate('TaskScheduling',{tp:3,jobId:jobId,
                                    callback: ()=>{
                                        this.findTodayDispathCarTask(0);
                                    }
                                })}
                        >改派</Button>
                    </FItem>
                    <FItem style={[styles.listFItem]}>
                        <Button type="primary"
                                onClick={()=>this.props.navigation.navigate('TaskScheduling',{tp:4,jobId:jobId,
                                    callback: ()=>{
                                        this.findTodayDispathCarTask(0);
                                    }
                                })}
                        >撤回</Button>
                    </FItem>
                    <FItem style={[styles.listFItem]}>
                        <Button type="warning"
                                onClick={()=>this.props.navigation.navigate('TaskScheduling',{tp:5,jobId:jobId,
                                    callback: ()=>{
                                        this.findTodayDispathCarTask(0);
                                    }
                                })}
                        >取消</Button>
                    </FItem>
                </Flex> 
            )
        }
    }
    //1接人丶2送人丶3取货丶4送货丶5公务丶6调研丶7接待
    typeModel(item){
        let t = item.jobType;
        if( t == 1 || t == 2){
            return(
                <View>
                    <Item extra={item.personCount}>接送人数：</Item>
                    <Item extra={item.flight}>航班车次：</Item>
                    <Item extra={item.driverName || '暂未指派司机'}>司机：</Item>
                </View>
            )
        }else if(t == 3 || t == 4){
            return (
                <View>
                    <Item extra={item.goodsName}>品名：</Item>
                    <Item extra={item.specifications}>单位：</Item>
                    <Item extra={item.goodsCount}>数量：</Item>
                    <Item extra={item.contacts}>联系人：</Item>
                    <Item>附件：</Item>
                </View>
            )
        }else if(t == 5){
            <Item extra={item.workDescription}>公务说明：</Item>
        }
    }

    //颜色
    color(t){
        let arr = [
            styles.state01,
            styles.state02,
            styles.state03,
            styles.state04,
            styles.state05,
            styles.state06
        ]
        return arr[t];
    }

    _renderItem(item,index){
        return (
            <Accordion className="my-accordion" onChange={this.accordionChange} style={styles.accordion} >
                <Accordion.Panel className="pad" header={
                    <Flex>
                        <FItem style={[styles.FItems,styles.FItem1,this.color(item.jobType)]}>
                            <Text style={[styles.texts,styles.text1]} >{Tool.getMessages(item.jobType,"jobType")}</Text>
                        </FItem>
                        <FItem  style={[styles.FItems,styles.FItem2]}>
                            <Flex direction="column">
                                <FItem>
                                    <Text style={[styles.texts]}>{Tool.formate(item.startTime,5)} 从 {item.startPlace}</Text>
                                </FItem>
                                <FItem>
                                    <Text style={[styles.texts]}>{Tool.formate(item.desTime,5)} 到 {item.destination}</Text>
                                </FItem>
                                    {item.driverName ? 
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={[styles.texts,styles.textLeft]}>司机：{item.driverName}</Text>
                                            <Text style={[styles.texts,styles.textRight]}>改派</Text>
                                        </View> : 
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={{flex:1,marginLeft: 20,}}></Text>
                                            <Text style={{flex:1,fontSize:16,color:'#028ce5',textAlign:'center',}}>派车</Text>
                                        </View>
                                    }
                            </Flex>
                        </FItem>
                    </Flex>
                    }>
                    <List  className="my-list">
                        <Item extra={item.jobId} wrap={true}>单号：</Item>
                        <Item extra={item.startAddress}>起点：</Item>
                        <Item extra={item.desAddress}>终点：</Item>
                        <Item extra={item.applyPerson}>申请人：</Item>
                        <Item extra={item.telephone}>联系电话：</Item>
                        <Item extra={Tool.getMessages(item.carType,"carType")}>车辆类型：</Item>
                        <Item extra={item.plateNumber}>车牌号：</Item>

                        {this.typeModel(item)}

                        <Item extra={item.accompanyPerson}>申请单位：</Item>
                        <Item extra={item.remark}>备注：</Item>
                        {this.buttons(item.status,item.jobId)}
                    </List>
                </Accordion.Panel>
            </Accordion>
        )
    }
    render (){
        return(
            <View style={styles.container}>
                <NavgationBar
                    title='任务调度'
                    statusBar={{backgroundColor:'#028ce5'}}
                    leftButton={
                        <TouchableOpacity style={{width:50}} onPress={()=>this.props.navigation.openDrawer()}>
                            <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/menu.png')}/>
                        </TouchableOpacity>
                    }
                    rightButton={
                        <TouchableOpacity 
                            style={{width:50}} 
                            onPress={()=>{
                                this.props.navigation.navigate('TaskSchedulingSearch',{
                                    carType: this.state.carType,
                                    selectPlace: this.state.selectPlace,
                                    selectDate: this.state.selectDate,
                                    callBack:(c,p,d)=>{
                                        this.setState({
                                            isRefresh: true,
                                            showFoot: 0,
                                            list: [],
                                            carType: c,//用车类型
                                            selectPlace:p, //过滤地点
                                            selectDate:d,//用车日期
                                        },function(){
                                            this.findTodayDispathCarTask(0)
                                        });
                                    }
                                })}}>
                            <Text style={{flex:1,color:'#fff',textAlign:'center',lineHeight:50,fontSize:16}}>搜索</Text>
                        </TouchableOpacity>
                    }
                />
                <FlatList
                    data={this.state.list}
                        renderItem={({item,index}) => this._renderItem(item,index)}
                        //每行唯一的key值
                        keyExtractor={(item,index) => index}
                        //下拉刷新相关
                        onRefresh={() => this._onRefresh()}
                        refreshing={this.state.isRefresh}
                        //上拉加载更多
                        ListFooterComponent={this.renderFooter.bind(this)}//上拉加载中状态
                        onEndReached={() =>this._onLoadMore()}//上拉加载更多
                        onEndReachedThreshold={1}
                        //行与行之间的分隔线组件
                        ItemSeparatorComponent={()=><View style={{height:2,backgroundColor:'#F5F5F5'}}/>}
                    />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f4f4f4',
    },
    FItems:{
        paddingTop:10,
        paddingBottom:10,
    },
    FItem1:{
        flex:0,
        width:30,
        height:'100%',
        backgroundColor:"#028ce5",
    },
    FItem2:{
        flex:1
    },
    texts:{
        color:"#000",
        fontSize: 16,
        textAlign:'center',
    },
    text1:{
        color:"#fff"
    },
    listFItem:{
        padding:10,
    },
    accordion:{
        backgroundColor:"#fff",
    },
    footer:{
        flexDirection:'row',
        height:24,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
    },
    textLeft:{
        flex:1,
        borderColor: '#BF931D',
        borderWidth: 1,
        borderRadius: 4,
        textAlign:'center',
        marginLeft: 20,
    },
    textRight:{
        flex:1,
        textAlign: 'center',
        color:'#028ce5'
    },
    state01:{
		backgroundColor:'#0287DF'
	},
	state02:{
		backgroundColor:'#5AC8FB'
	},
	state03:{
		backgroundColor:'#FFCA00'
	},
	state04:{
		backgroundColor:'#FF9501'
	},
	state05:{
		backgroundColor:'#51D767'
	},
	state06:{
		backgroundColor:'#4BDB5F'
	},
});