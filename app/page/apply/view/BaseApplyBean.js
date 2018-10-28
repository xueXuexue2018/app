import {View, Text, StyleSheet} from 'react-native';
import React, {Component} from "react";

export class BaseApplyBean extends Component {

    loadingSuccess = false;

    checkInput(){
        console.error('当前还没有定义检查输入的方法');
        return false;
    };
    //返回布局文件
    renderContentView (){
        return <View/>
    };
    //提交的函数
    commitData(){
      if (this.state.isNeed && !this.checkInput(this.state.value)) {
          //是必填项，但是没有填
          return {}
      }  else{
          return {id : this.state.id,value:this.state.value};
      }
    };
    /*
    由于刷新是被动完成的，所以要等刷新完才拿到完整的数据，
    导致获取改变值的时候，不能直接写在改变的回调监听里面，
    无法返回正确的改变值，所以通过以下方法直接返回结果值。
     */
    commitDataWithValue(value){
        if (this.state.isNeed && !this.checkInput(value)) {
            //是必填项，但是没有填
            return {}
        }  else{
            return {id : this.state.id,value:value};
        }
    };

    /**
     * 获取控制的元素并更新状态进行刷新界面
     * @param controller    控制的所有键值对
     */
    onControlled=(controller)=>{
        let tempState = {};
        for (let i =0;i<this.state.controlled.length;i++){
            let controlledElement = this.state.controlled[i];
            if (controller[controlledElement]!==undefined){
                let transformerElement = this.state.transformer[controlledElement];
                tempState[transformerElement]=controller[controlledElement];
                this.props[transformerElement] = controller[controlledElement];
            }
        }
        if (this.loadingSuccess){
            this.setState(tempState);
        } else{
            Object.assign(this.state,tempState);
        }
    };

    constructor(props) {
        super(props);
        let isShow = props.isShow!==undefined?props.isShow:true;
        this.state = {
            id: props.id,
            value: '',
            isShow: isShow,
            label:props.label,
            isNeed : props.isNeed,
            controlled: [],
            transformer:{}          //控制的变量转化成属性值
        };
        // props.isShow = true;
        // if (this.state.isNeed){
        //     this.state.label = '* '+this.state.label;
        // }
        if (props.controlled !== undefined) {
            this.state.controlled = props.controlled;
        }
        if (props.transformer !== undefined) {
            this.state.transformer = props.transformer;
        }
        if (props.setHandler!==undefined){
            props.setHandler(this.onControlled);
        }
    }

    componentDidMount(){
        let props = this.props;
        this.loadingSuccess = true;
    }

    addSign(){
        if(this.state.isNeed){
            return <View>
                <Text style={style.sign}>*</Text>
            </View>
        }else{
            return null;
        }
    }

    render() {
        let props = this.props;
        if (props.state){
            for (let key in this.state){
                props.state[key] = this.state[key];
            }
        }
        props.state['checkInput']=this.checkInput;
        let contentView;
        if (this.state.isShow) {
            contentView = <View style={{flexDirection:'row'}}>
                {this.addSign()}
                <View style={{flex:1}}>
                {this.renderContentView()}
                </View>
            </View>;
        }else{
            contentView = <View style={{height:0}}>
            </View>;
        }
        return contentView;
    }

}
const style = StyleSheet.create({
    sign :{
        color:'red',
        backgroundColor:'white',
        textAlign:'center',
        textAlignVertical: "center",
        flex:1,
        paddingLeft:6
    }
});