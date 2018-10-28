import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import NavigatorBar from '../../components/NavgationBar';
import {
    Accordion,Toast,
} from 'antd-mobile-rn';
import HttpUtil from "../../components/HttpUtil";
import Tool from "../../components/Tool";

export default class TaskDetails extends Component{
    constructor(props){
        super(props);
        //状态
        this.carData='';
        this.state = {
            carData:'',//上个页面的数据
            // 列表数据结构
            data:[],
            // 下拉刷新
            isRefresh:true,
            // 加载更多
            session: '',
            // isLoadMore:false,
            showFoot:0,// 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            type:1,
            updateTime:0
        }

    }
    //渲染render之前调用
    componentDidMount(){
        //获取session
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret});
            this.findCarTask();//获取当前车辆任务详情
        });
        //获取上个页面传过来的值
        this.carData=this.props.navigation.state.params.nextData;
    }
    render(){
        return(
            <View style={styles.container}>
                <NavigatorBar
                    title={'任务详情'}
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
                    <Image style={{width:35,height:25,marginRight:10}} source={require('../../res/img/qstd_littlecar_icon.png')}/>
                    <Text style={{fontSize:18}}>{this.carData.plateNumber}，共</Text>
                    <Text style={{fontSize:18,color:'#028ce5'}}>{this.carData.jobCount}</Text>
                    <Text style={{fontSize:18}}>项任务</Text>
                </View>
                <FlatList

                    data={this.state.data}

                    renderItem={({item,index}) => this._createListItem(item,index)}

                    keyExtractor={(item,index) => index}

                    onRefresh={() => this._onRefresh()}
                    refreshing={this.state.isRefresh}

                    ListFooterComponent={this._createListFooter.bind(this)}
                    onEndReached={() =>this._onLoadMore()}
                    onEndReachedThreshold={0.1}
                />
            </View>
        )
    }
    //返回
    goBack(){
        this.props.navigation.goBack();
    }
    //查询当前车辆的任务数详情
    findCarTask(){
        let dataT=new FormData();
        dataT.append("session",this.state.session);//session
        dataT.append("type",this.state.type);//第一次加载1，加载更多2
        dataT.append("updateTime",this.state.updateTime);
        dataT.append("status","2");
        dataT.append("recordCount",this.state.data.length);//当前列表的条数
        dataT.append("userInfoId",this.carData.userInfoId);
        HttpUtil.post('/carManage/phone/carJobs/findSelfJobs',dataT)
            .then(result=>{
                if(result.code == 1){
                    let con=JSON.parse(result.content);
                    // console.warn(con);
                    if(con.length>0){
                        if(this.state.type === 1){//第一次加载
                            this.setState({
                                data: con,
                                isRefresh:false,
                                updateTime:con[0].updateTime
                            })
                        }else{//上拉加载更多
                            this.setState({
                                // 数据源刷新 add
                                data: this.state.data.concat(con),
                                showFoot:0,
                                updateTime:con[0].updateTime
                            })
                        }
                    }else {
                        this.setState({
                            isRefresh:false,
                            // 数据源刷新 add
                            data: this.state.data.concat(con),
                            showFoot:1
                        })
                    }

                }else if(result.code == 2){
                    Toast.info(result.content,3);
                    this.setState({
                        isRefresh:false,
                        showFoot:1
                    })
                }else if(result.code == 3){
                    Toast.info(result.content,2);
                    this.setState({
                        isRefresh:false,
                        showFoot:1
                    })
                }else if(result.code == 4){
                    Toast.fail(result.content,3);
                    this.setState({
                        isRefresh:false,
                        showFoot:1
                    })
                }
            })
    }
    /**
     * 创建每行布局
     */
    _createListItem(item,index){
        let typeHtml=null;
        let bgColor=null;
        if (item.jobType==1||item.jobType==2){//接人
            bgColor={backgroundColor:'#0287DF'};
            typeHtml=<View><Text style={styles.txtheidStyle}>接送人数：{item.personCount} </Text>
            <Text style={styles.txtheidStyle}>航班车次：{item.flight} </Text>
            <Text style={styles.txtheidStyle}>司    机：{item.driverName}</Text></View>
        } else if (item.jobType==3||item.jobType==4){//取货 送货
            bgColor={backgroundColor:'#FFCA00'};
            typeHtml=<View><Text style={styles.txtheidStyle}>品    名：{item.goodsName} </Text>
                <Text style={styles.txtheidStyle}>单    位：{item.specifications} </Text>
                <Text style={styles.txtheidStyle}>数    量：{item.goodsCount} </Text></View>
        } else if (item.jobType==5){//公务
            bgColor={backgroundColor:'#51D767'};
            typeHtml=<View><Text></Text></View>;
        }else if (item.jobType==6){//调研
            bgColor={backgroundColor:'#FFCA00'};
            typeHtml=<View><Text></Text></View>;
        } else if (item.jobType==7){//接待
            bgColor={backgroundColor:'#FF9501'};
            typeHtml=<View><Text></Text></View>;
        }
        return (
            <View style={styles.listItemStyle}>
                <Accordion  className="my-accordion" onChange={this.onChange}>
                    <Accordion.Panel header={
                    <View style={styles.listHeader} >
                        <View style={[styles.listHeaderText,bgColor]}>
                            <Text style={[styles.listHeaderText,bgColor]}>{Tool.getMessages(item.jobType,"jobType")}</Text>
                        </View>
                        <View style={styles.timeActive}>
                            <Text style={styles.txtStyle}>{Tool.formate(item.startTime,5)} 从<Text style={{color:'#028CE5'}}>{item.startPlace}</Text></Text>
                            <Text style={styles.txtStyle}>{Tool.formate(item.desTime,5)} 到<Text style={{color:'#028ce5'}}>{item.destination}</Text></Text>
                        </View>
                    </View>} className="pad">

                        <View  style={{backgroundColor:'#fff',paddingLeft:10}}>
                            <Text style={styles.txtheidStyle}>单    号：{item.jobId}</Text>
                            <Text style={styles.txtheidStyle}>起    点：{item.startPlace} </Text>
                            <Text style={styles.txtheidStyle}>终    点：{item.destination} </Text>
                            <Text style={styles.txtheidStyle}>申 请 人：{item.applyPerson}</Text>
                            <Text style={styles.txtheidStyle}>联系电话：{item.telephone}</Text>
                            <Text style={styles.txtheidStyle}>车辆类型：{Tool.getMessages(item.carType,"carType")}</Text>
                            {typeHtml}
                            <Text style={styles.txtheidStyle}>申请单位：{item.accompanyPerson} </Text>
                            <Text style={styles.txtheidStyle}>备    注： {item.remark}</Text>
                        </View>

                    </Accordion.Panel>
                </Accordion>
            </View>
        );
    }
    //下拉刷新
    _onRefresh(){
        // 不处于 下拉刷新
        if(!this.state.isRefresh){
            this.setState({
                isRefresh:true
            });
            this.page = 1;
            this.findCarTask();
        }
    }
    /**
     * 加载更多
     * @private
     */
    _onLoadMore(){
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot != 0 ){
            return ;
        }
        // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
        //底部显示正在加载更多数据
        this.setState({
            showFoot:2,
            type:2
        });
        // 获取数据
        this.findCarTask();
    }
    /**
     * 创建底部布局
     */
    _createListFooter(){
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
                    <ActivityIndicator
                        animating={true}
                        color='#333'
                    />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={styles.footer}>

                </View>
            );
        }
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    listItemStyle:{
        backgroundColor:'white',
        justifyContent:'flex-start',
    },
    icon:{
        width:25,
        height:25,
        marginLeft:10
    },
    tapManage:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingBottom:10,
        paddingTop:10,
        borderBottomColor:'#d5d5d5',
        borderStyle:'solid',
        borderBottomWidth:1,

    },
    footer:{
        flexDirection:'row',
        height:24,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
    },
    txtStyle:{
        fontSize: 16,
        backgroundColor:'#fff',
        paddingBottom:10
    },
    timeActive:{
        padding:10
    },
    listHeader:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
    },
    listHeaderText:{
        fontSize:18,
        width:25,
        backgroundColor:'#028ce5',
        alignItems:'center',
        justifyContent:'center',
        color:'#fff',
        paddingLeft:2
    },
    txtheidStyle:{
        borderBottomWidth:1,
        borderBottomColor:'#d5d5d5',
        backgroundColor:'#fff',
        fontSize:16,
        padding:10
    }
});