import HttpUtil from "../../../components/HttpUtil";

export class BaseFormData {
    /**
     * 保存控制的元素
     */
    controller = {};
    /**
     * 保存处理的方法
     */
    handler = [];
    /**
     *  用来存放一些数据
     */
    source = {};
    /**
     * 表单数据源
     */
    data = [];


    getController=()=> {
        return this.controller;
    };

    setControllerValue=(key, value) =>{
        this.controller[key] = value;
        //遍历所有监听
        for (let i =0;i<this.handler.length;i++){
            let itemHandler = this.handler[i];
            itemHandler(this.controller);
        }
    };

    setHandler = (handleMethod)=>{
        this.handler.push(handleMethod);
    };

    /**
     * 修改表单数据
     */
    onFormDataChange() {

    }

    /**
     * 提交数据
     */
    onCommitData() {

    }

    /**
     * 保存数据
     */
    saveResult(itemResult) {

    }

    /**
     * 上传图片
     */
    uploadPic(){
    }

    /**
     * 初始化
     */
    init(){

    }

    constructor(){
        this.init();
    }

    static jobType = [
        {label: '接人', value: "1"},
        {label: '送人', value: "2"},
        {label: '取货', value: "3"},
        {label: '送货', value: "4"},
        {label: '公务', value: "5"},
        {label: '调研', value: "6"},
        {label: '接待', value: "7"}
    ];

    static carType = [
        {label: '小车', value: "1"},
        {label: '面包车', value: "2"},
        {label: '中巴车', value: "3"}
    ];

    static isReview = [
        {label: '是', value: "1"},
        {label: '否', value: "2"},
    ];

    static timeType = [
        {label: '之前', value: "1"},
        {label: '准时', value: "2"},
        {label: '不限时间', value: "3"},
        {label: '与某人联系', value: "4"}
    ];
}