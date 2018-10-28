import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import NavgationBar from "../../components/NavgationBar";
import HttpUtil from "../../components/HttpUtil";
import  ApprovalOpinion from './ApprovalOpinion';

export default class ApprovalDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            dataSource: '',
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            jobId: this.props.navigation.state.params.jobId,
            session: '',
            workProcessInfoId: this.props.navigation.state.params.workProcessInfoId,
            workInfoId: this.props.navigation.state.params.workInfoId,
            opinionData: [],

            reviewStatus:this.props.navigation.state.params.reviewStatus,
        }

        //获取session
        storage.load({
            key: 'session'
        }).then(ret => {
            this.setState({session: ret})

            //请求数据
            this.fetchData();

        })
    };

    // static navigationOptions = ({ navigation }) => ({
    //     headerRight: this.renderRightBar()
    // });

//网络请求——获取第pageNo页数据
    fetchData() {
        this.findCarJobsByJobId();
        this.findAllWorkViewByWorkInfoIdStopSelf(this.state.workInfoId, this.state.workProcessInfoId)

    }
//获取任务信息
    findCarJobsByJobId(){
        let fd = new FormData();
        fd.append("jobId", this.state.jobId.toString());
        fd.append("session", this.state.session);

        HttpUtil.post('/carManage/phone/myApproval/findCarJobsByJobId', fd)
            .then(result => {
                if (result.code == 1) {
                    let data = JSON.parse(result.content);

                    this.setState({
                        //复制数据源
                        dataSource: data,
                        isLoading: false,
                        isRefreshing: false,

                    });

                    data = null;
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
                this.setState({
                    error: true,
                    errorInfo: error
                })
            })

    }
    //移动端根据工作流程id查找所有填写的意见到自己这层为止
    findAllWorkViewByWorkInfoIdStopSelf(workInfoId, workProcessInfoId) {

        let fd = new FormData();
        fd.append("jobId", this.state.jobId.toString());
        fd.append("session", this.state.session);
        fd.append("workInfoId", workInfoId);
        fd.append("workProcessInfoId", workProcessInfoId);
        HttpUtil.post('/carManage/phone/myApproval/findAllWorkViewByWorkInfoIdStopSelf', fd)
            .then(result => {
                if (result.code == 1) {

                    let data = JSON.parse(result.content);

                    this.setState({
                        //复制数据源
                        opinionData: data,
                        isLoading: false,
                        isRefreshing: false,

                    });
                    data = null;
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
                this.setState({
                    error: true,
                    errorInfo: error
                })
            })
    }

    render() {
        var content = this.state.dataSource;

        //这些是共有的
        //任务类型
        var jobType = content['jobType'] || "";
        //开始时间
        var startTime = this.transTime(content['startTime']) || "";
        //到达时间
        var desTime = this.transTime(content['desTime']) || "";
        //车辆类型
        var carType = content['carType'] || "";
        //任务状态
        var status = content['status'] || "";
        //工作流id
        var workName = content['workName'] || "";
        //联系人
        var contacts = content['contacts'] || "";
        //联系电话
        var telephone = content['telephone'] || "";
        //申请单位
        var accompanyPerson = content['accompanyPerson'] || "";
        //开始类型
        var startType = content['startType'] || "";
        //结束类型
        var desType = content['desType'] || "";
        //开始地点
        var startPlace = content['startPlace'] || "";
        //开始地点详细地址
        var startAddress = content['startAddress'] || "";
        //目的地点
        var destination = content['destination'] || "";
        //目的地点详细地址
        var desAddress = content['desAddress'] || "";
        //备注
        var remark = content['remark'] || "";


        // 这些是取货和送货共有的
        //品名
        var goodsName = content['goodsName'] || "";
        //规格
        var specifications = content['specifications'] || "";
        //数量
        var goodsCount = content['goodsCount'] || "";
        //送达时间
        //取货时间

        //这些是送人和接人共有的
        //送人数量
        var personCount = content['personCount'] || "";
        //航班车次
        var flight = content['flight'] || "";

        //公务说明
        var workDescription = content['workDescription'] || "";

        //审核人员
        var viewUserName = content['viewUserName'] || "";
        //审核结果
        var result = content['result'] || "";
        //审核意见
        var viewInfo = content['viewInfo'] || "";
        //待审核 1
        var reviewStatus = content['reviewStatus'] || 0;


        var jobStr = ''
        if (jobType == 1) {//接人
            jobStr = '接人';
        } else if (jobType == 2) {
            jobStr = '送人';
        } else if (jobType == 3) {
            jobStr = '取货';
        } else if (jobType == 4) {
            jobStr = '送货';
        } else if (jobType == 5) {
            jobStr = '公务';
        } else if (jobType == 6) {
            jobStr = '调研';
        } else if (jobType == 7) {
            jobStr = '接待';
        }

        //车辆类型
        if (carType == 1) {
            carType = "小车"
        } else if (carType == 2) {
            carType = "面包车"
        } else if (carType == 3) {
            carType = "中巴车"
        }

        //任务状态
        if (status == 1) {
            status = "待派"
        }
        if (status == 2) {
            status = "待完成"
        } else if (status == 3) {
            status = "已完成"
        } else if (status == 4) {
            status = "已取消"
        } else if (status == 5) {
            status = "已退回"
        }

        //出发时间
        if (startType == 1) {
            startType = "之前";
        } else if (startType == 2) {
            startType = "准时";
        } else if (startType == 3) {
            startType = "不限时间";
        } else if (startType == 4) {
            startType = "与某人联系";
        }

        //到达时间
        if (desType == 1) {
            desType = "之前";
        } else if (desType == 2) {
            desType = "准时";
        } else if (desType == 3) {
            desType = "不限时间";
        } else if (desType == 4) {
            desType = "与某人联系";
        }

        if (result == 1) {
            result = "通过";
        } else if (result == 2) {
            result = "不通过";
        }

        return (
            <View style={styles.container}>
                <NavgationBar
                    title='审核详情'
                    statusBar={{
                        backgroundColor: '#028ce5'
                    }}
                    leftButton={
                        <TouchableOpacity onPress={
                            ()=>{this.props.navigation.goBack();
                            this.props.navigation.state.params.onCallback()}
                        }>
                            <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/back.png')}/>
                        </TouchableOpacity>
                    }
                    rightButton={this.renderRightBar()}
                />
                <View style={styles.container}>
                    <ScrollView

                        //  默认为垂直排列 此属性为true改为水平排列
                        horizontal={false}
                        //  禁用水平滚动条
                        showsHorizontalScrollIndicator={false}
                        //  自动分页限ios
                        pagingEnabled={true}
                        //  禁用滚动限ios
                        // scrollEnabled={false}
                    >
                        <View style={styles.textView}>
                            <Text style={styles.txtStyle}>
                                任务信息
                            </Text>
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
                            {this.renderSign('任务类型',jobStr)}


                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign('车辆类型',carType)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign('任务状态',status)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign('工作流名称',workName)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign('联系人',contacts)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign('联系电话',telephone)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
                            {this.renderJobType1(jobType)}
                            {this.renderJobType2(jobType)}
                            {this.renderJobType3(jobType)}
                            {this.renderJobType4(jobType)}

                            {this.renderSign(jobType==3?'取货时间':'出发时间',startTime)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign('开始时间类型',startType)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign(jobType==4?'送达时间':'到达时间',desTime)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign('结束时间类型',desType)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign('起始地点',startPlace)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign('详细地址',startAddress)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign('目的地址',destination)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>

                            {this.renderSign('详细地址',desAddress)}
                            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
                            {this.renderJobType5(jobType)}
                            <Text style={styles.txtStyle}>
                                备注        {remark}
                            </Text>

                        </View>
                        <View style={styles.listStyle}>
                            {
                                this.renderOpinionView(this.state.opinionData)
                            }

                        </View>
                    </ScrollView>

                </View>


            </View>
        )


    }
    renderSign(title,item){
        return   <View style={{flexDirection:'row'}}>
            <View>
                <Text style={styles.xin}>*</Text>
            </View>
            <View>
                <Text style={styles.txtStyle2}>
                    {title}     {item}
                </Text>
            </View>
        </View>
    }
//是否显示填写意见按钮
      renderRightBar(){

        if (this.state.reviewStatus!='1'){
            return;
        }
        return <Text style={styles.backBar}
                  onPress={
                         () => this.props.navigation.navigate('ApprovalOpinion',
                        {
                            jobId: this.state.jobId,
                            workInfoId: this.state.dataSource.workInfoId,
                            workProcessInfoId: this.state.workProcessInfoId,
                            onCallback: ()=> {
                                this.fetchData();
                            }
                        }
                    )
                }

                >填写意见</Text>
          }
    //接人-1、 送人-2、取货-3、送货-4
    renderJobType1(jobType) {
        if (jobType != 1) {
            return;
        }
        var content=this.state.dataSource;
        return <View style={styles.textView}>

            <Text style={styles.txtStyle}>
                接人数量        {content.personCount}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            <Text style={styles.txtStyle}>
                航班/车次        {content.flight}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            <Text style={styles.txtStyle}>
                申请单位        {content.accompanyPerson}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
        </View>
    }

    renderJobType2(jobType) {
        if (jobType != 2) {
            return;
        }
        var content=this.state.dataSource;
        return <View style={styles.textView}>


            <Text style={styles.txtStyle}>
                送人数量        {content.personCount}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            <Text style={styles.txtStyle}>
                航班/车次        {content.flight}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            <Text style={styles.txtStyle}>
                申请单位        {content.accompanyPerson}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
        </View>

    }

    renderJobType3(jobType) {
        if (jobType != 3) {
            return;
        }
        var content=this.state.dataSource;
        return <View style={styles.textView}>
            <Text style={styles.txtStyle}>
                品名        {content.goodsName}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            <Text style={styles.txtStyle}>
                规格        {content.specifications}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            <Text style={styles.txtStyle}>
                货物数量        {content.goodsCount}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            <Text style={styles.txtStyle}>
                申请单位        {content.accompanyPerson}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            {/*<Text style={styles.txtStyle}>*/}
                {/**取货时间        {this.transTime(content.startTime) || ""}*/}
            {/*</Text>*/}
            {/*<View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>*/}

        </View>
    }

    renderJobType4(jobType) {
        if (jobType != 4) {
            return;
        }
        var content=this.state.dataSource;
        return <View style={styles.textView}>
            <Text style={styles.txtStyle}>
                品名        {content.goodsName}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            <Text style={styles.txtStyle}>
                规格        {content.specifications}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            <Text style={styles.txtStyle}>
                货物数量        {content.goodsCount}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            <Text style={styles.txtStyle}>
                申请单位        {content.accompanyPerson}
            </Text>
            <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            {/*<Text style={styles.txtStyle}>*/}
                {/**送达时间        {this.transTime(content.desTime) || ""}*/}
            {/*</Text>*/}
            {/*<View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>*/}

        </View>
    }
    renderJobType5(jobType) {
        if (jobType != 5) {
            return;
        }

        var content = this.state.dataSource;
        return<View style={styles.textView}>

            <Text style={styles.txtStyle}>
                公务说明      {content.workDescription}
            </Text>
            <View style={{backgroundColor: '#F5F5F5', marginLeft: 20, height: 1}}></View>
            <Text style={styles.txtStyle}>
                申请单位      {content.accompanyPerson}
            </Text>
            <View style={{backgroundColor: '#F5F5F5', marginLeft: 20, height: 1}}></View>
        </View>
    }

    //拼接审核信息
    renderOpinionView = (data) => {


        let views = [];
        for (let i = 0; i < data.length; i++) {


            const text = data[i];
            if (text.result == 1) {
                text.result = "通过";
            } else if (text.result == 2) {
                text.result = "不通过";
            }
            views.push(<View style={styles.listStyle}>
                {this.showApprovalHeader(i)}
                <Text style={styles.txtStyle}>审核人员        {text.viewUserName}</Text>
                <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
                <Text style={styles.txtStyle}>审核结果        {text.result}</Text>
                <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
                <Text style={styles.txtStyle}>审核意见        {text.viewInfo}</Text>
                <View style={{backgroundColor:'#F5F5F5',marginLeft:20,height:1}}></View>
            </View>)
        }

        return views;
    }

    showApprovalHeader(index){
        if (index==0){
            return <Text style={styles.txtStyle}>审核信息</Text>;
        }else{
            return <View style={{height:0}}/>
        }
    }

    //转换日期，日期格式：yyyy-MM-dd HH:mm:ss
    transTime(val) {
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
        display = year + "-" + month + "-" + day + "  " + "  " + hour + ":" + minute;
        return display;
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#F5F5F5',
    },
    //文本的view
    textView:{
        backgroundColor:'white',

    },
    xin:{

        backgroundColor:'white',
        marginBottom:1,
        height:40,
        width:'20%',
        justifyContent:'center',
        alignItems:'center',
        lineHeight:40,
        color:'red',
    },
    txtStyle:{
        marginLeft:20,
        backgroundColor:'white',
        marginBottom:1,
        height:40,
        width:'70%',
        justifyContent:'center',
        alignItems:'center',
        lineHeight:40,
    },

    xin:{
        marginLeft:20,
        backgroundColor: 'white',
        marginBottom: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 40,
        color:'red',
    },
    txtStyle2: {

        backgroundColor: 'white',
        marginBottom: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 40,
    },
    backBar:{
        marginLeft:20,
        color:'white',
        fontSize:20,
    },
    listStyle:{
        marginTop:20,
        backgroundColor:'white'
    }
});