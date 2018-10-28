import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image, 
    ActivityIndicator,
} from 'react-native';
import {
    Modal, 
    Button, 
    WhiteSpace, 
    WingBlank, 
    Toast, 
    Accordion, 
    List
} from 'antd-mobile-rn';
import HttpUtil from "../../components/HttpUtil";

import TaskItem from './TaskItem'
const alert = Modal.alert;
let pageNo = 1;//当前第几页
let totalPage=5;//总的页数
let itemNo=0;//item的个数
export default class CurrentTaskList extends Component {
    static navigationOptions = {
        drawerLabel: '当前任务'
    };

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            dataSource:[],
            isLoading: true,
            session: '',
            //网络请求状态
            error: false,
            errorInfo: "",
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing:false,//下拉控制
            selected: '任务状态:待完成',
            statusInput:2,//
        }
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({ session: ret });
            this.fetchData(this.state.statusInput,1,0)
        })
    }
    //statusInput 2:待完成3:已完成4:已中止5:已取消
    //type：1表示获取最新，2表示加载更多
    fetchData(statusInput,type,recordCount)
    {
        let data = new FormData();
        data.append("session",this.state.session);
        data.append("type",type);
        data.append("updateTime",parseInt((new Date()).valueOf()/1000));
        data.append("status",statusInput);
        data.append("recordCount",recordCount);

        HttpUtil.post('/carManage/phone/carJobs/findSelfJobs',data)
            .then(result=>{
                if(result.code === 1){
                    let data = JSON.parse(result.content);
                    let dataBlob = [];
                    let i = itemNo;
                    pageNo++;
                    data.map(function (item) {
                        dataBlob.push({
                            key: i,
                            value: item,
                        })
                        i++;
                    });
                    itemNo = i;
                    let foot = 0;
                    if(pageNo>=totalPage){
                        foot = 1;//listView底部显示没有更多数据了
                    }

                    this.setState({
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
        // //第一次加载等待的view
        // if (this.state.isLoading && !this.state.error) {
        //     return this.renderLoadingView();
        // } else if (this.state.error) {
        //     //请求失败view
        //     return this.renderErrorView();
        // }
        return(
            <View  style={{flex:1}}>
                <WingBlank size="lg">
                    <WhiteSpace size="lg" />
                <Button
                    onClick={() =>
                        alert('请选择任务状态', <Text style={styles.findText}  ></Text>, [
                            { text: '待完成', onPress: () => {this.setState({selected:'任务状态:待完成',dataSource:[],statusInput:2}), this.fetchData(2,1,0)} },
                            { text: '已完成', onPress: () => {this.setState({selected:'任务状态:已完成',dataSource:[],statusInput:3}), this.fetchData(3,1,0)} },
                            { text: '已中止', onPress: () => {this.setState({selected:'任务状态:已中止',dataSource:[],statusInput:4}), this.fetchData(4,1,0)} },
                            { text: '已取消', onPress: () => {this.setState({selected:'任务状态:已取消',dataSource:[],statusInput:5}), this.fetchData(5,1,0)} },
                        ])
                    }
                >
                    {this.state.selected}
                </Button>
                </WingBlank>
                <View style={styles.listStyle}>
                    <FlatList
                        style={{}}
                        // ListFooterComponent={this._renderFooter.bind(this)}
                        ref={(flatList)=>this._flatList = flatList}
                        ItemSeparatorComponent={this._separator}
                        renderItem={this._renderItem.bind(this)}
                        keyExtractor={this._keyExtractor}
                        ListFooterComponent={this._renderFooter.bind(this)}
                        // onEndReached={this._onEndReached.bind(this)}
                        //下拉刷新相关
                        onRefresh={() => this._onRefresh()}
                        refreshing={this.state.isRefreshing}
                        data={this.state.dataSource}>
                    </FlatList>
                </View>
            </View>
                )
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

    _flatList;
//此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item.key;
    _renderItem = ({item,index}) => {

        return <View style={styles.listItemStyle}>
            <Accordion  className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel className="pad" header={
                    <View style={styles.listHeader} >
                        <View style={styles.listHeaderText}>
                            <Text style={styles.listHeaderText}>{getSta(item.value.jobType)}</Text>
                        </View>
                        <View>
                            <Text style={styles.txtStyle}> {transTime(item.value.startTime)+' 从 '+item.value.startPlace}</Text>
                            <Text style={styles.txtStyle}> {transTime(item.value.desTime)+' 到 '+item.value.destination}</Text>
                        </View>
                    </View>
                }>

                    <TaskItem dataSource={item.value} jobType={item.value.jobType}/>

                </Accordion.Panel>
            </Accordion>
        </View>
    }

    _separator = () => {
        return <View style={{height:2,backgroundColor:'#F5F5F5'}}/>;
    }

    //加载等待页
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    color='red'
                    size="large"
                />
            </View>
        );
    }
    //加载失败view
    renderErrorView() {
        return (
            <View style={styles.container}>
                <Text>
                    Fail
                </Text>
            </View>
        );
    }

    //下拉刷新
    _onRefresh=()=>{
        // 不处于 下拉刷新
        if(!this.state.isRefreshing){
            this.setState({
                isRefreshing:true
            });
            this.page = 1;
            this.fetchData(this.state.statusInput,1,0);
            this.setState({dataSource:[]})
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
                    <Text></Text>
                </View>
            );
        }
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
                    <Text style={{height:40,alignItems:'center',justifyContent:'flex-start',}}
                          onPress={()=>this.fetchData(this.state.statusInput,2,pageNo*15)}
                    >上拉加载更多</Text>
                </View>
            );
        }
    }

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

const styles=StyleSheet.create({
    findView:{
        height:60,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        margin:10,
        borderRadius:10,
        borderWidth:1,
        borderColor:'white',
        backgroundColor:'#fff',
    },
    findText:{
        fontSize: 18,
        color: '#8B8878',
        padding:5,
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
        justifyContent:'flex-start',
        backgroundColor:"#ffffff"
    },
    listHeaderText:{
        textAlign :'center',
        justifyContent:'center',
        backgroundColor:'#028ce5',
        color:'white',
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