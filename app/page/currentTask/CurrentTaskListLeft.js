import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
    , ActivityIndicator,
} from 'react-native';
import {
    List,
    Accordion,
} from 'antd-mobile-rn';

import CurrentTaskDetailsStop from "./CurrentTaskDetailsStop";
import HttpUtil from "../../components/HttpUtil";
import {Toast} from "antd-mobile-rn";
import TaskItem from './TaskItem'
var navigation ;
let pageNo = 1;//当前第几页
let itemNo=0;//item的个数
export default class CurrentTaskListLeft extends Component {
    static navigationOptions = {
        drawerLabel: '当前任务'
    };

    constructor(props) {
        super(props);
        navigation = this.props.navigation;
        this.state = {
            text: '000',
            dataSource:[],
            isLoading: true,
            session: '',
            //网络请求状态
            error: false,
            errorInfo: "",
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing:false,//下拉控制
        }
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret });
            this.fetchData(1,0)
        })
    }
    fetchData2() {
        this.setState({
            //复制数据源
            text:'123'
        });
    }
    fetchData=(type,recordCount)=>
    {
        if (recordCount === 0){
            this.setState({dataSource:[]})
            pageNo=1;
        }
        let data = new FormData();
        data.append("session",this.state.session);
        data.append("type",type);
        data.append("updateTime",parseInt((new Date()).valueOf()/1000));
        data.append("recordCount",recordCount);

        HttpUtil.post('/carManage/phone/carJobs/findSelfCurrentJobs',data)
            .then(result=>{
                if(result.code === 1){
                    pageNo++;
                        let data = JSON.parse(result.content);
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
                            text:result.content,
                            //复制数据源
                            isLoading: false,
                            dataSource:this.state.dataSource.concat(dataBlob),
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
                    result: JSON.stringify(error)
                })
            })

    }

    render (){
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return <View></View>;
        } else if (this.state.error) {
            //请求失败view
            return this.renderErrorView();
        }

        return(
            <View  style={{flex:1}}>

                <View style={styles.listStyle}>
                    <FlatList
                        ref={(flatList)=>this._flatList = flatList}
                        ItemSeparatorComponent={this._separator}
                        renderItem={this._renderItem.bind(this)}
                        keyExtractor={this._keyExtractor}
                        ListFooterComponent={this._renderFooter.bind(this)}
                        //下拉刷新相关
                        onRefresh={() => this._onRefresh()}
                        refreshing={this.state.isRefreshing}
                        data={this.state.dataSource}>
                    </FlatList>
                </View>
            </View>
                )
    }
    _flatList;
//此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item.key;
    _renderItem = ({item,index}) => {

        return <View style={styles.listItemStyle}>
            <Accordion  className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header={<View style={styles.listHeader} >
                    <View style={styles.listHeaderText}>
                    <Text style={styles.listHeaderText}>{getSta(item.value.jobType)}</Text>
                    </View>
                    <View>
                        <Text style={styles.txtStyle}> {transTime(item.value.startTime)+'从'+item.value.startPlace}</Text>
                        <Text style={styles.txtStyle}> {transTime(item.value.desTime)+'到'+item.value.destination}</Text>
                    </View>
                </View>}className="pad">

                    <View  style={{backgroundColor:'#8B8878'}}>
                        <TaskItem dataSource={item.value} jobType={item.value.jobType} session={this.state.session}/>

                        <View style={styles.titleButton}>

                            <Text style={styles.leftButton} onPress={()=>navigation.navigate('CurrentTaskDetailsStop',{info:item.value,
                                refresh: this.fetchData(1,0) })} >中 止</Text>

                            <View style={{width:1,backgroundColor:"#e5e5e5"}}/>

                            <Text style={styles.rightButton} onPress={()=>navigation.navigate('CurrentTaskDetailsComplete',{info:item.value,
                                refresh: this.fetchData })}>完 成</Text>

                        </View>


                    </View>

                </Accordion.Panel>
            </Accordion>
        </View>
    }
renderCarType(item){
        if (item.value.carType=='1'){
            return '车辆类型：小车';
        } else if(item.value.carType=='2'){
            return '车辆类型：面包车';
        }else if (item.value.carType=='3') {
            return '车辆类型：中巴车'
        }else {
            return '车辆类型：中巴车';
        }

}
    _separator = () => {
        return <View style={{height:2,backgroundColor:'#F5F5F5'}}/>;
    }
    //下拉刷新
    _onRefresh=()=>{
        // 不处于 下拉刷新
        if(!this.state.isRefreshing){
            this.setState({
                isRefreshing:true
            });
            this.page = 1;
            this.fetchData(1,0)
            // this.setState({dataSource:[]})
        }
    };
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
                          onPress={()=>this.fetchData(2,pageNo*15)}
                    >上拉加载更多</Text>
                </View>
            );
        }
    }

    //1接人丶2送人丶3取货丶4送货丶5公务丶6调研丶7接待
    typeModel(item){
        let t = item.jobType;
        if( t == 1 || t == 2){
            return(
                <View>
                    <List.Item extra={item.personCount}>接送人数：</List.Item>
                    <List.Item extra={item.flight}>航班车次：</List.Item>
                    <List.Item extra={item.driverName}>司机：</List.Item>
                </View>
            )
        }else if(t == 3 || t == 4){
            return (
                <View>
                    <List.Item extra={item.goodsName}>品名：</List.Item>
                    <List.Item extra={item.specifications}>单位：</List.Item>
                    <List.Item extra={item.goodsCount}>数量：</List.Item>
                    <List.Item extra={item.contacts}>联系人：</List.Item>
                </View>
            )
        }else if(t == 5){
            <List.Item extra={item.workDescription}>公务说明：</List.Item>
        }
    }

}
//转换日期，日期格式：yyyy-MM-dd HH:mm:ss
function transTime(val) {
    var display;
    var date = new Date();
    date.setTime(val);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    display = month + "-" + day + "  " + "  " + hour + ":" + minute;
    return display;
}
//1接人丶2送人丶3取货丶4送货丶5公务丶6调研丶7接待
function getSta(val) {
    var display='接人';
   switch (val) {
       case 1:
           display='接人';
           break;
       case 2:
           display='送人';
           break;
       case 3:
           display='取货';
           break;
       case 4:
           display='送货';
           break;
       case 5:
           display='公务';
           break;
       case 6:
           display='调研';
           break;
       case 7:
           display='接待';
           break;
   }
    return display;
}
const styles=StyleSheet.create({
    listStyle:{
        flex:1,
        marginTop:10,
        backgroundColor:'#F5F5F5',
        marginBottom:0,
    },
    listItemStyle:{
        flex:1,
        backgroundColor:'white',
        justifyContent:'flex-start',
    },
    txtStyle:{
        fontSize: 16,
        backgroundColor:'#fff',
        padding:10,
        marginBottom:0.5,
    },
    listHeader:{
        flex:1,
        flexDirection:'row',
        backgroundColor:'#fff',
        justifyContent:'flex-start',
    },
    listHeaderText:{
        textAlign :'center',
        justifyContent:'center',
        backgroundColor:'#028ce5',
        color:'white',
    },
    titleButton:{
        flex:1,
        flexDirection:'row',
        flexGrow:1,
        justifyContent:'center',
        alignItems:'center',
    },
    leftButton:{
        flex:1,
        fontSize: 20,
        color: 'red',
        backgroundColor:'#E5E5E5',
        textAlign:'center',
        justifyContent: 'center',
        padding:10,
    },
    rightButton:{
        flex:1,
        fontSize: 20,
        color: '#8FBC8F',
        backgroundColor:'#E5E5E5',
        textAlign:'center',
        justifyContent: 'center',
        padding:10,
    },
    imageStyle:{
        width: 300,
        height: 300,
        margin:5,
    },
    footer:{
        flexDirection:'row',
        height:24,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        marginBottom:5
    },
})