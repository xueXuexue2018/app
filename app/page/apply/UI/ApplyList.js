import React, {Component} from 'react';
import {
    View,
    Text, 
    FlatList, 
    StatusBar, 
    ToastAndroid, 
    AsyncStorage, 
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import NavgationBar from '../../../components/NavgationBar';
import {Picker, List} from 'antd-mobile-rn';
import HttpUtil from "../../../components/HttpUtil";
import {Toast} from 'antd-mobile-rn';
import ListItemView from "../view/ListItemView";

export default class ApplyList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            selected: ["0"],
            isLoading: false,
            isLoadSuccess: false,
            data: [],
            isRefresh:false
        }
    }

    static navigationOptions = {
        drawerLabel: '我的申请'
    };

    componentWillMount() {
        console.log('开始加载页面中');
        this.getDataList(0, 0);
    }

    getSession() {
        AsyncStorage.getItem('session')
            .then((value) => {
                console.log('获取session成功' + value);
            })
    }

    _keyExtractor = (item, index) => item.id;

    async getDataList(status, num) {
        return await storage.load({
            key: 'session'
        })
            .then(
                (value) => {
                    console.log('获取到session ，开始发请求');
                    return value;
                }
            )
            .catch((error) => {
                console.error(error);
            })
            .then(
                (session) => {
                    let formData = new FormData();
                    formData.append("session", session);
                    formData.append("status", status);//任务状态
                    formData.append("jobType", "0");//任务类型
                    formData.append("recordCount", num);//当前条数
                    return formData;
                }
            )
            .then((formData) => {
                // console.log('传过来的 session：' + session);
                HttpUtil.post('/carManage/phone/myApplication/findCarJobsByParamsOfPage', formData)
                    .then((result) => {
                        console.log('请求到数据了,code = ' + result.code);
                        if (result.code == 1) {
                            let content = JSON.parse(result.content);
                            console.log(content);
                            if(num>0){
                                this.setState({
                                    isLoading: false,
                                    isLoadSuccess: true,
                                    data: this.state.data.concat(content),
                                    isRefresh:false
                                });
                            }else{
                                this.setState({
                                    isLoading: false,
                                    isLoadSuccess: true,
                                    data: content,
                                    isRefresh:false
                                });
                            }

                            // Toast.success('获取数据成功', 2);
                        } else if (result.code == 2) {
                            Toast.info(result.content,2);
                        } else if (result.code == 3) {
                            Toast.fail(result.content,2);
                            this.props.navigation.navigate('Login');
                        } else if (result.code == 4) {
                            Toast.fail(result.content,2);
                        }
                    })
                    .catch(error => {
                        console.log('请求出错了：' + error);
                    })
            })
            .catch(error => {
                console.log('组合请求参数出错：' + error);
            })

    }

    getNextPage() {
        // if (!this.state.isLoading) {
        // console.log('正在加载更多！');
            this.getDataList(this.state.selected[0], this.state.data.length);
        // }
    };

    /**
     * 下拉刷新
     * @private
     */
    _onRefresh=()=>{
        // 不处于 下拉刷新
        if(!this.state.isRefresh){
            this.setState({
                isRefresh:true
            });
            this.getDataList(this.state.selected[0],0);
        }
    };

    render() {
        const district = [
            {label: '全部', value: '0'},
            {label: '待派', value: '1'},
            {label: '待完成', value: '2'},
            {label: '已完成', value: '3'},
            {label: '已取消', value: '4'},
            {label: '已退回', value: '5'}
        ];
        let listView;
        if (this.state.isLoadSuccess && (!this.state.isLoading)) {
            listView = <FlatList
                data={this.state.data}
                renderItem={(item) => {
                    return <ListItemView data={item}
                                         navigation ={this.props.navigation}
                    />;
                }}
                onRefresh={() => this._onRefresh()}
                refreshing={this.state.isRefresh}
                keyExtractor={this._keyExtractor}
                onEndReachedThreshold={0.1}
                onEndReached={() => this.getNextPage()}
            />;
        } else {
            listView = <Text>正在加载中</Text>;
            // this.getDataList(this.state.selected.value, this.state.data.length);
            // this.getDataList(this.state.selected.value,this.state.data.length);

        }
        const { navigate } = this.props.navigation;
        let rightButton = <Text
            style = {style.titleBarRightBtn}
            onPress={
                () => {
                    // 对象的同名方法可以直接接括号调用
                    navigate('Apply',{callback:()=>{
                            this.getDataList(this.state.selected[0],0);
                        }});
                    // navigate('Map');
                }
            }
        >申请</Text>;
        return (
            <View style={style.root}>
                <NavgationBar
                    title={'我的申请'}
                    style={{
                        backgroundColor: '#028ce5'
                    }}
                    leftButton={
                        <TouchableOpacity onPress={()=>this.props.navigation.openDrawer()}>
                            <Image style={{width:22,height:22,margin:5}} source={require('../../../res/img/menu.png')}/>
                        </TouchableOpacity>
                    }
                    rightButton={rightButton}
                    statusBar={{backgroundColor: '#028ce5'}}
                />
                <Picker data={district} cols={1}
                    value = {this.state.selected}
                    onOk={(value) => {
                        this.setState({
                            isLoadSuccess: false,
                            selected: value
                        });
                        this.getDataList(value[0], 0);
                    }}
                >
                    <List.Item arrow="horizontal">任务状态</List.Item>
                </Picker>
                {listView}
            </View>
        )
    };

}

const style = StyleSheet.create({
    root: {
        flex: 1
        // height:400
    },
    titleBarLeftBtn:{
        marginLeft:20,
        color:'white',
        fontSize:20,
    },
    titleBarRightBtn:{
        marginRight:20,
        color:'white',
        fontSize:20,
    }
});