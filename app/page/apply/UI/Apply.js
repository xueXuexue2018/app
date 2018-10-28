import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    StatusBar,
    FlatList,
    NativeModules, Image
} from 'react-native';
import {Toast} from "antd-mobile-rn"
import NavgationBar from "../../../components/NavgationBar";
import {StringInputBean} from "../view/StringInputBean";
import {JierenFormData} from "../data/JierenFormData";
import HttpUtil from "../../../components/HttpUtil";
import {SongrenFormData} from "../data/SongrenFormData";
import {QuhuoFormData} from "../data/QuhuoFormData";
import {SonghuoFormData} from "../data/SonghuoFormData";
import {GongwuFormData} from "../data/GongwuFormData";
import {DiaoyanFormData} from "../data/DiaoyanFormData";
import {JiedaiFormData} from "../data/JiedaiFormData";
import ApplyList from "./ApplyList";

export default class Apply extends Component {


    constructor(props) {
        super(props);
        //获取图片存放路径
        storage.load({
            key: 'imgUrl'
        }).then(ret => {
            this.setState({
                path : ret.applyCarImage
            });
        });
        storage.load({
            key: 'session'
        }).then(session=>{
            this.setState({
                session:session
            })
        })
        let jierenFormData = new JierenFormData();
        let songrenFormData = new SongrenFormData();
        let quhuoFormData = new QuhuoFormData();
        let songhuoFormData = new SonghuoFormData();
        let gongwuFormData = new GongwuFormData();
        let diaoyanFormData = new DiaoyanFormData();
        let jiedaiFormData = new JiedaiFormData();
        var dataArray = [
            jierenFormData,
            songrenFormData,
            quhuoFormData,
            songhuoFormData,
            gongwuFormData,
            diaoyanFormData,
            jiedaiFormData
        ];

        for (let i = 0; i < dataArray.length; i++) {
            let formData = dataArray[i];
            formData.onFormDataChange = this.changeFormData;
            formData.onCommitData = this.commitForm;
            formData.saveResult = this.saveResult;
            formData.uploadPic = this.uploadPic;
        }
        this.state = {
            dataArray: dataArray,
            data: dataArray[0],
            result: {},
            workInfo: []
        }
    }

    componentWillMount() {
        let workInfoPromise = this.getWorkInfo();
        workInfoPromise
            .then((workInfoData) => {
                for (let i = 0; i < this.state.dataArray.length; i++) {
                    let formData = this.state.dataArray[i];
                    // formData.onFormDataChange = this.changeFormData;
                    // formData.onCommitData = this.commitForm;
                    // formData.saveResult = this.saveResult;
                    formData.setControllerValue("data", workInfoData);
                    // console.warn("获取到工作流："+workInfoData);
                }
                this.setState(
                    {
                        workInfo: workInfoData,
                        data: this.state.dataArray[0]
                    }
                );
            })
            .catch(error => {
                console.log("获取到工作流，但配置出错：" + error);
            })

    }

    //保存表单数据
    saveResult = (itemResult) => {
        if (itemResult.id !== undefined) {
            let result = this.state.result;
            result[itemResult.id] = itemResult.value;
            this.setState({
                result: result
            });
        }
    };
//切换表单
    changeFormData = (value) => {
        // 旧的写法，但是很多控件都不刷新
        // let formData =this.state.dataArray[value - 1];
        // this.setState({data: formData});
        // 没办法，只能先把数据清掉，再从新添加
        this.setState({data: {data: []}, result: {}});
        setTimeout(() => {
            let formData = this.state.dataArray[value - 1];
            this.setState({data: formData});
        }, 50);

    };

    /**
     * 校验表单
     */
    checkFrom() {
        let data = this.state.data.data;
        let result = this.state.result;
        for (let item of data) {
            let props = item.props;
            let state = props.state;
            if (props.isNeed && state.isShow) {
                if (Array.isArray(props.id)) {
                    // 有多个id 的情况
                    let ids = props.id;
                    for (let i = 0; i < ids.length; i++) {
                        let id = ids[i];
                        if (!result[id]) {
                            // 拿不到值 ，判断为没填写
                            Toast.fail("请填写" + props.label);
                            return false;
                        }
                    }
                } else {
                    // 只有一个id 的情况
                    if (!result[props.id]) {
                        // 拿不到值 ，判断为没填写
                        Toast.fail("请填写" + props.label);
                        return false;
                    }
                    if ( !state.checkInput(state.value)){
                        return false;
                    }
                }
            }else{
                    if (result[props.id]){
                        // 非必填项，有值的情况下，进行检查
                        if ( !state.checkInput(state.value)){
                            return false;
                        }
                    }
            }
        }
        return true;
    }

//提交表单信息
    commitForm = (form) => {
        // console.log('下面打印 表单信息');
        // console.log(this.state.result);
        if (!this.checkFrom()) {
            return;
        }
        storage.load({
            key: 'session'
        })
            .then((session) => {

                this.state.result.session = session;
                this.state.result.status = "1";
                if (this.state.result.isReview == 1) {
                    this.state.result.reviewStatus = "1";
                } else if (this.state.result.isReview == 2) {
                    this.state.result.workName = null;
                    this.state.result.reviewStatus = "5";
                }
                // this.state.result.startLongitude = '113.530002';
                // this.state.result.startLatitude = '22.802068';
                // this.state.result.desLongitude = '113.530002';
                // this.state.result.desLatitude = '22.802852';
                let data = this.state.result;
                let formData = new FormData();
                for (let [k, v] of Object.entries(data)) {
                    console.log(k + ' = ' + v);
                    if (v != null && v != undefined && v != "") {
                        formData.append(k, v);
                    }
                }

                HttpUtil.post('/carManage/phone/carJobs/addCarJobs', formData)
                    .then((result) => {

                        if (result.code == 1) {
                            let carId = result.content;
                            this.setState({
                                carId:carId
                            });
                            // this.props.navigation.navigate('ApplyList');
                            Toast.success('提交申请成功！', 2);
                            // this.props.navigation.state.params.callback();
                            form.setControllerValue("commit",false);
                            form.setControllerValue("showImg",true);
                        } else {
                            Toast.fail('获取数据失败: ' + result.content, 2);
                        }
                    })

            })
            .catch(error => {
                console.log("网络请求失败：" + error);
            })
    };

    /**
     * 获取工作流
     */
    async getWorkInfo() {
        return storage.load({
            key: 'session'
        })
            .then((session) => {
                let formData = new FormData();
                formData.append('session', session);
                return HttpUtil.post('/carManage/phone/myApplication/findSelfRelationWorkInfo', formData);
            })
            .then((result) => {
                if (result != null || result != undefined) {
                    // let workInfo = JSON.parse(result.content);
                    let workInfo = result;
                    let selectData = [];
                    let workInfoArray = workInfo;
                    // es6 中 数组的扩展方法在 debug 模式下可以使用，但是正常运行的时候就不行，语法解析不了
                    // for (let value of workInfoArray.values()) {
                    for (let i = 0; i < workInfoArray.length; i++) {
                        let value = workInfoArray[i];
                        selectData.push({label: value.workName, value: value.workInfoId});
                    }
                    // console.warn("处理工作流："+selectData);
                    return selectData;
                } else {
                    return [];
                }
            })
            .catch((error) => {
                console.log('获取工作流失败: ' + error);
            })
    }

    uploadPic = async () => {
        let fileName = this.state.carId+'_'+new Date().getTime()+'.jpg';
        let imgSrc = await NativeModules.ImageCrop.selectWithCrop(fileName, this.state.path, this.state.session).then(result => {
            console.warn(result)
            if (result == 1) {
                console.warn('进去下载')
                return 'http://120.76.84.8:8080/carManage/phone/skipPage/downloadApplyCarImage?applyCarImage=' + fileName + '&session=' + this.state.session;
            } else {
                Toast.info('照片保存失败', 2);
                return null;
            }
        }).catch(e => {

        });
        if (imgSrc!=undefined && imgSrc!=null){
            return imgSrc;
        }else{
            return null;
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        const statusBar = <StatusBar/>;
        const leftButton = <TouchableOpacity onPress={()=>{
            this.props.navigation.navigate('ApplyList');
            this.props.navigation.state.params.callback();
        }
        }>
            <Image style={{width:22,height:22,margin:5}} source={require('../../../res/img/back.png')}/>
        </TouchableOpacity>;
        const title = <Text
            style={style.titleBarLeftBtn}
        >申请用车</Text>;
        const navigationBar = <NavgationBar statusBar={statusBar}
                                            titleView={title}
                                            leftButton={leftButton}
        />;
        let list;
        if (this.state.data.data.length === 0) {
            list = <View/>
        } else {
            list = <FlatList
                data={this.state.data.data}
                keyExtractor={(item, index) => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={(item) => {
                    return item.item;
                }}
            />
        }
        return (
            <View style={{flex: 1,backgroundColor:'white'}}>
                {navigationBar}
                {list}
            </View>
        )
    }
}
const style = StyleSheet.create({
    titleBarLeftBtn: {
        marginLeft: 20,
        color: 'white',
        fontSize: 20,
    },
    titleBarRightBtn: {
        marginRight: 20,
        color: 'white',
        fontSize: 20,
    },

});