import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Image
} from 'react-native';
import {
    Accordion, List,// 手风琴
    SearchBar, Button, WhiteSpace, WingBlank,// 查询
    Flex, Toast,
    Modal,
    Picker, TextareaItem
} from 'antd-mobile-rn';
import HttpUtil from '../../components/HttpUtil';
import Tool from '../../components/Tool';
import NavgationBar from '../../components/NavgationBar';

export default class TaskScheduling extends Component {

    constructor(props) {
        super(props);
        this.state = {
            session: '',
            departmentLIstanbul: [],//部门列表
            driverNameList: [],// 司机列表
            plateNumList: [], // 车辆列表
            departmentValue: [],// 选中的部门的值
            driverNameValue: [],// 选中的司机的值
            driverNameLabel: '',//选中的司机的名称
            plateNumValue: [],// 选中的车牌号的值
            plateNumLabel: '',//选中的车牌号名称
            type: props.navigation.state.params.tp,//类型
            text: ''
        };

    }

    //渲染render之前调用
    componentDidMount() {
        //获取session
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({session: ret});
            this.carDispatchFindDriver();
            this.getAllCarInfo()
        });
    }

    // 获取部门列表
    carDispatchFindDriver() {
        let data = new FormData();
        data.append("session", this.state.session);
        data.append("id", '');
        HttpUtil.post('/carManage/phone/carTaskDispath/carDispatchFindDriver', data)
            .then(result => {
                // result = JSON.parse(result);
                let dlist = [];
                for (let i = 0; i < result.length; i++) {

                    let resultI = result[i];

                    let obj = {};
                    let departmentId = resultI.departmentId || '';
                    let departmentName = resultI.departmentName || '';
                    obj.value = departmentId;
                    obj.label = departmentName;
                    dlist.push(obj);
                }
                this.setState({
                    departmentList: dlist,
                    departmentValue:[dlist[0].label]
                })

            })
            .catch(error => {
                Toast.fail('链接服务器失败，请检查网络', 2);
            })
    }

    //获取所有车辆列表
    getAllCarInfo() {
        let data = new FormData();
        data.append("session", this.state.session);
        HttpUtil.post('/carManage/phone/carInfo/getAllCarInfo', data)
            .then(result => {
                result = JSON.parse(result.content);
                let dlist = [];
                for (let i = 0; i < result.length; i++) {
                    let resultI = result[i];

                    let obj = {};
                    let carId = resultI.carId || '';
                    let plateNumber = resultI.plateNumber || '';
                    obj.value = carId;
                    obj.label = plateNumber;
                    dlist.push(obj);
                }
                this.setState({
                    plateNumList: dlist,
                    plateNumLabel:[dlist[0].label]
                })
            })
            .catch(error => {
                Toast.fail('链接服务器失败，请检查网络', 2);
            })
    }

    // 根据部门id查询司机
    deChange() {
        let data = new FormData();
        data.append("session", this.state.session);
        data.append("id", this.state.departmentValue[0]);
        HttpUtil.post('/carManage/phone/carTaskDispath/carDispatchFindDriver', data)
            .then(result => {
                let dlist = [];
                for (var i = 0; i < result.length; i++) {
                    let resultI = result[i];
                    let obj = {};
                    let driverId = resultI.driverId || '';
                    let driverName = resultI.driverName || '';
                    obj.value = driverId;
                    // obj.label = driverName.replace("<font color='red","(").replace("</font","").replace(">","");
                    if (driverName.split("<").length >1){
                        obj.label = driverName.split("<")[0]+"(已接车)";

                    } else {
                        obj.label = driverName.split("<")[0];

                    }

                    dlist.push(obj);
                }
                this.setState({
                    driverNameList: dlist,
                    driverNameLabel:[dlist[0].label]
                })
            })
            .catch(error => {
                Toast.fail('链接服务器失败，请检查网络', 2);
            })
    }

    onConfirm() {
        if (
            this.state.departmentValue.length ==0
            || this.state.driverNameValue.length==0
            || this.state.plateNumValue.length==0
        ) {
            Toast.fail("请填写完整信息！");
            return;
        }

        Modal.alert('您当前选择：', this.getMessage(), [
            { text: '取消', onPress: () => console.log('已选取消') },
            {
                text: '确定',
                onPress: () =>
                    this.confirmData()
            },
        ]);
    }

    getMessage(){
        let plateNumLabel = this.state.plateNumLabel;
        let driverNameLabel = this.state.driverNameLabel;
        let text = "车牌号为："+plateNumLabel+"\n"+"是否确认派给："+driverNameLabel+"？";
        return <Text style={{color:'red'}}>{text}</Text>;
    }

    confirmData(){
        let operPromise;
        switch (this.state.type) {
            case 1:
                //派车
                operPromise = this.dispatchCar();
                break;
            case 2:
                //取消
                operPromise = this.abortSublime();
                break;
            case 3:
                //改派
                operPromise = this.changeDispatchCar();
                break;
            case 4:
                //撤回
                operPromise = this.chehuiSublime();
                break;
            case 5:
                //取消
                operPromise = this.quxiaoSublime();
                break;
            default:
                break;
        }
        operPromise
            .then(
                () => {
                    this.props.navigation.state.params.callback();
                }
            );
    }

    /**
     * 派车
     */
    async dispatchCar() {

        let data = new FormData();
        data.append("session", this.state.session);
        data.append("jobId", this.props.navigation.state.params.jobId);
        data.append("driverId", this.state.driverNameValue[0]);
        data.append("driverName", this.state.driverNameLabel);
        data.append("plateNumber", this.state.plateNumLabel);
        data.append("carId", this.state.plateNumValue[0]);

        return await HttpUtil.post('/carManage/phone/carTaskDispath/updCarJobs', data)
            .then(result => {
                if (result.code == 1) {
                    Toast.success(result.content, 2);
                }else if (result.code==3){
                    this.props.navigation.navigate('Login');
                }
                this.props.navigation.pop();
            })
            .catch(error => {
                Toast.fail('链接服务器失败，请检查网络', 2);
            })
    }

    /**
     * 改派
     */
    async changeDispatchCar() {
        let data = new FormData();
        data.append("session", this.state.session);
        data.append("jobId", this.props.navigation.state.params.jobId);
        data.append("driverId", this.state.driverNameValue[0]);
        data.append("driverName", this.state.driverNameLabel);
        data.append("plateNumber", this.state.plateNumLabel);
        data.append("carId", this.state.plateNumValue[0]);
        return await HttpUtil.post('/carManage/phone/carTaskDispath/changeCarJobs', data)
            .then(result => {
                if (result.code == 1) {
                    Toast.success(result.content, 2);
                }else if (result.code==3){
                    this.props.navigation.navigate('Login');
                }
                this.props.navigation.pop();
            })
            .catch(error => {
                Toast.fail('链接服务器失败，请检查网络', 2);
            })
    }

    /**
     * 派车取消任务
     */
    async abortSublime() {
        if (this.state.text==''){
            Toast.fail("请输入取消理由");
            return;
        }
        let data = new FormData();
        data.append("session", this.state.session);
        data.append("quxiaoReason", this.state.text);
        data.append("jobId", this.props.navigation.state.params.jobId);
        return await HttpUtil.post('/carManage/phone/carTaskDispath/cancelCarJobs', data)
            .then(result => {
                if (result.code == 1) {
                    Toast.success(result.content, 2);
                }
                this.props.navigation.pop();
            })
            .catch(error => {
                Toast.fail('链接服务器失败，请检查网络', 2);
            })
    }

    /**
     * 改派取消任务
     */
    async quxiaoSublime() {
        //调用的是同一个接口，传参也是一样的
        return await this.abortSublime();
    }

    /**
     * 撤回任务
     */
    async chehuiSublime() {
        if (this.state.text==''){
            Toast.fail("请输入撤回理由");
            return;
        }
        let data = new FormData();
        data.append("session", this.state.session);
        data.append("returnReason", this.state.text);
        data.append("jobId", this.props.navigation.state.params.jobId);
        return await HttpUtil.post('/carManage/phone/carTaskDispath/returndCarJobs', data)
            .then(result => {
                if (result.code == 1) {
                    Toast.success(result.content, 2);
                }
                this.props.navigation.pop();
            })
            .catch(error => {
                Toast.fail('链接服务器失败，请检查网络', 2);
            })
    }

    setLabel(data,value) {
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.value == value) {
                return data[i].label;
            }
        }
        return "";
    }

    getTextArea(placeholder){
        return <TextareaItem
            placeholder={placeholder}
            rows = {5}
            onChange={
                (values) => {
                    this.setState({text: values});
                }
            }
        />;
    }

    render() {
        console.log(this.state.departmentValue)
        console.log(this.state.driverNameValue)
        console.log(this.state.plateNumLabel)

        let content = <View/>;
        switch (this.state.type) {
            case 1:
            case 3:
                content =
                    <List>
                        <Picker
                            data={this.state.departmentList}
                            cols={1}
                            value={this.state.departmentValue}
                            onOk={(v) => {
                                this.setState({
                                    departmentValue:v
                                },function(){
                                    this.deChange();
                                });
                            }}
                        >
                            <List.Item arrow="horizontal" last>部门：</List.Item>
                        </Picker>
                        <Picker
                            data={this.state.driverNameList}
                            cols={1}
                            value={this.state.driverNameValue}
                            onOk={(v) => {
                                this.setState({
                                    driverNameValue: v,
                                    driverNameLabel: this.setLabel(this.state.driverNameList,v[0])
                                });
                            }}
                        >
                            <List.Item arrow="horizontal" last>司机：</List.Item>
                        </Picker>
                        <Picker
                            data={this.state.plateNumList}
                            cols={1}
                            value={this.state.plateNumValue}
                            onOk={(v) => {
                                this.setState({
                                    plateNumValue: v,
                                    plateNumLabel: this.setLabel(this.state.plateNumList, v[0])
                                });
                            }}
                        >
                            <List.Item arrow="horizontal" last>车辆：</List.Item>
                        </Picker>
                    </List>;
                break;
            case 2:
                content = this.getTextArea("请输入取消理由");
                break;
            case 4:
                content = this.getTextArea("请输入撤回理由");
                break;
            case 5:
                content = this.getTextArea("请输入取消理由");
                break;
        }

        return (
            <View>
                <NavgationBar
                    title='任务调度'
                    statusBar={{backgroundColor: '#028ce5'}}
                    leftButton={
                        <TouchableOpacity style={{width: 50}} onPress={() => this.props.navigation.goBack()}>
                            <Image style={{width: 22, height: 22, margin: 5}}
                                   source={require('../../res/img/back.png')}/>
                        </TouchableOpacity>
                    }
                />
                {content}
                <View style={{padding: 20, marginTop: 30}}>
                    <Button type='primary'
                            onClick={() => {
                                this.onConfirm();
                            }}
                    >确定</Button>
                </View>
            </View>
        )
    }
}