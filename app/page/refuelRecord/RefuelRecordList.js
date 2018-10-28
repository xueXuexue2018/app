import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
    Alert,
    RefreshControl
} from 'react-native';
import HttpUtil from "../../components/HttpUtil";
import { Toast,Flex } from 'antd-mobile-rn';
import NavgationBar from '../../components/NavgationBar';
import Tool from '../../components/Tool';
export default class RefuelRecordList extends Component{
    constructor(props){
        super(props);
        this.state = {
            session: '',
            data: '',//加油列表
            carId: '',//接车的id
            jcMsg: '',//显示的接车信息
            plateNumber: '',//车牌号
            type: 1,//类型
            updateTime: 0,//更新时间
            recordCount: 0,//当前条数
            addDate:'',//添加时间
            userName:'',//加油司机
            oilNumber:'',//加油升数
            oilsType:'',//油类型
            price:'',//单价
            showAdd: false,//是否显示添加
            isRefresh: true,//是否显示loading
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        }
    }

     //渲染render之前调用
     componentDidMount(){
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret });
            this.checkIsmeet()
        })
     }

    //判断是否已接车
    checkIsmeet(){
        let fd = new FormData();
        fd.append('session',this.state.session);
        HttpUtil.post('/carManage/phone/carTrans/checkIsmeet',fd)
            .then(result=>{
                if(result.code == 1) {
                    if(result.note == 1) {//已接车
                        let d = JSON.parse(result.content);
                        let plateNumber = d.plateNumber;//车牌号
                        let carId = d.carId;
                        this.setState({
                            carId : carId,
                            jcMsg : '您已接车辆为: '+plateNumber,
                            plateNumber: plateNumber,
                            showAdd: true
                        });
                        this.getList()
                    }else{
                        Toast.info("暂未接车,请先完成接车操作");
                        this.setState({
                            isRefresh: false,
                            jcMsg: '当前用户暂未接车',
                        })
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

    //获取所有加油记录
    //isback==1 是从上一页返回需要刷新
    getList(isback){

        if (isback===1){
            this.setState({
                isRefresh:true,
                recordCount:0,
                "type": 1
            })
        }
        if(this.state.recordCount > 0) {
            this.setState({
                "type": 2
            })
        }
        let fd = new FormData();
        fd.append('session',this.state.session);
        fd.append('carId',this.state.carId);
        fd.append('type',this.state.type.toString());
        fd.append('updateTime',this.state.updateTime.toString());
        fd.append('recordCount','0');
        console.log(fd)
        HttpUtil.post('/carManage/phone/carOils/findAllCarOils',fd)
            .then(result=>{
                if(result.code == 1) {
                    let d = JSON.parse(result.content);
                    if(d.length>0) {
                        this.setState({
                            data: d,
                            recordCount : this.state.recordCount+d.length,
                            isRefresh: false,
                            showFoot:0
                        })
                    }else{
                        this.setState({
                            isRefresh:false,
                            showFoot:1
                        })
                    }
                }else if(result.code == 2) {
                    this.setState({isRefresh:false,showFoot:0});
                    Alert.alert('提示',result.content)
                }else if(result.code == 3) {
                    this.setState({isRefresh:false,showFoot:0});
                    Alert.alert('提示',result.content);
                    this.props.navigation.navigate('Login');
                } else {
                    this.setState({isRefresh:false,showFoot:0})
                    Alert.alert('提示',result.content)
                }
            })
    }


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

    getFlatList(item,index){
        return(
                        <View style={styles.box}>
                            <Flex style={[styles.item,styles.blueb]}>
                                <Text style={{flex:7,lineHeight:40}}>{Tool.formate(item.addDate)}</Text>
                                <Text style={{flex:3,lineHeight:40,backgroundColor:'#007ACC',color:'#fff'}}>行进了{item.mileage}km</Text>
                            </Flex>
                            <Flex style={styles.item}>
                                <Text style={styles.td}>加油站点：{item.gasStation}</Text>
                            </Flex>
                            <Flex style={styles.item}>
                                <Flex.Item>
                                    <Text>加油司机：</Text>
                                </Flex.Item>
                                <Flex.Item>
                                    <Text style={styles.br}>{item.userName}</Text>
                                </Flex.Item>
                                <Flex.Item>
                                    <Text>里程数：</Text>
                                </Flex.Item>
                                <Flex.Item>
                                    <Text>{item.mileage}km</Text>
                                </Flex.Item>
                            </Flex>
                            <Flex style={styles.item}>
                                <Flex.Item>
                                    <Text>加油升数：</Text>
                                </Flex.Item>
                                <Flex.Item>
                                    <Text style={styles.br}>{item.oilNumber}L</Text>
                                </Flex.Item>
                                <Flex.Item>
                                    <Text>单 价：</Text>
                                </Flex.Item>
                                <Flex.Item>
                                    <Text>￥{item.price}</Text>
                                </Flex.Item>
                            </Flex>
                            <Flex style={styles.item}>
                                <Flex.Item>
                                    <Text>油 类 型：</Text>
                                </Flex.Item>
                                <Flex.Item>
                                    <Text style={styles.br}>{item.oilsType}</Text>
                                </Flex.Item>
                                <Flex.Item>
                                    <Text>总金额：</Text>
                                </Flex.Item>
                                <Flex.Item>
                                    <Text>￥{item.sumPrice}</Text>
                                </Flex.Item>
                            </Flex>
                        </View>
        )
    }

    _onRefresh=()=>{

        if(!this.state.isRefresh){
            this.setState({
                isRefresh:true,
                data:[],
                recordCount:0
            })
            this.getList(1)
        }
    }
    _onLoadMore(){
        if(this.state.showFoot != 0 ){
            return
        }
        //底部显示正在加载更多数据
        this.setState({showFoot:2});
        //获取数据
        let fd = new FormData();
        fd.append('session',this.state.session);
        fd.append('carId',this.state.carId);
        fd.append('type',this.state.type.toString());
        fd.append('updateTime',this.state.updateTime.toString());
        fd.append('recordCount',this.state.recordCount);
        HttpUtil.post('/carManage/phone/carOils/findAllCarOils',fd)
            .then(result=>{
                if(result.code == 1) {
                    let d = JSON.parse(result.content);
                    if(d.length>0) {
                        this.setState({
                            data: this.state.data.concat(d),
                            recordCount : this.state.recordCount+d.length,
                            isRefresh: false,
                            showFoot:0
                        })
                    }else{
                        this.setState({
                            isRefresh:false,
                            showFoot:1
                        })
                    }
                }else if(result.code == 2) {
                    this.setState({isRefresh:false,showFoot:0});
                    Alert.alert('提示',result.content)
                }else if(result.code == 3) {
                    this.setState({isRefresh:false,showFoot:0});
                    Alert.alert('提示',result.content);
                    this.props.navigation.navigate('Login');
                } else {
                    this.setState({isRefresh:false,showFoot:0})
                    Alert.alert('提示',result.content)
                }
            })
    }


    render(){
        return(
            <View style={styles.container}>
                <NavgationBar
                    statusBar={{backgroundColor: '#028ce5'}}
                    leftButton={
                        <TouchableOpacity onPress={()=>this.props.navigation.openDrawer()}>
                            <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/menu.png')}/>
                        </TouchableOpacity>
                    }
                    title={'加油记录'}
                    rightButton={
                        this.state.showAdd?
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate('AddRefuelRecord',{carId:this.state.carId,
                                plateNumber:this.state.plateNumber,
                                onCallback: ()=> {
                                    this.getList(1) ;
                                }})}>
                                <Text style={styles.addBtn}>添加</Text>
                            </TouchableOpacity>:
                            null
                    }
                />

                <Text style={styles.jcTitle}>{this.state.jcMsg}</Text>
                
                <FlatList
                    data={this.state.data}
                    renderItem={({item,index}) => this.getFlatList(item,index)}
                    //每行唯一的key值
                    keyExtractor={(item,index) => index}
                    //下拉刷新相关
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefresh}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    refreshing={this.state.isRefresh}
                    //上拉加载更多
                    ListFooterComponent={this.renderFooter.bind(this)}//上拉加载中状态
                    onEndReached={() =>this._onLoadMore()}//上拉加载更多
                    onEndReachedThreshold={0.1}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#f4f4f4'
    },
    addBtn:{
        width:50,
        color:'#fff',
        textAlign:'center',
        lineHeight:50,
        fontSize:16
    },
    jcTitle:{
        height:40,
        lineHeight:40,
        color:'#fff',
        backgroundColor:'#999',
        paddingLeft:20
    },
    box:{
        backgroundColor: '#fff',
        marginBottom: 10
    },
    blueb:{
        borderBottomColor: '#007ACC',
        borderBottomWidth:1,
        paddingRight: 0
    },
    item:{
        height:40,
        // lineHeight:40,
        borderBottomColor:'#666',
        borderBottomWidth:1,
        paddingLeft:10,
        paddingRight: 10,
    },
    br:{
        height:40,
        lineHeight:40,
        borderRightColor:'#666',
        borderRightWidth:1
    },
    footer:{
        flexDirection:'row',
        height:24,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
    },



    
})

