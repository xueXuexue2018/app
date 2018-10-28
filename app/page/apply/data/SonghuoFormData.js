import React from "react";
import {StringInputBean} from "../view/StringInputBean";
import {SelectedInputBean} from '../view/SelectedInputBean';
import {DateInputBean} from "../view/DateInputBean";
import {BaseFormData} from "./BaseFormData";
import {CommitBean} from "../view/CommitBean";
import {WorkFlowInputBean} from "../view/WorkFlowInputBean";
import {LocationInputBean} from "../view/LocationInputBean";
import {ImageInputBean} from "../view/ImagInputBean";

export class SonghuoFormData extends BaseFormData {
    data = [
        <SelectedInputBean
            id = 'jobType'
            label='任务类型'
            isNeed={true}
            defaultValue = {["4"]}
            data={BaseFormData.jobType}
            saveData ={(value) => {
                this.saveResult(value);
            }
            }
            onSelectedChange={(value) => {
                this.onFormDataChange(value)
            }}
            state = {{}}
        />,
        <SelectedInputBean
            id ='carType'
            label='车辆类型'
            isNeed={true}
            defaultValue = {["1"]}
            data={BaseFormData.carType}
            onSelectedChange={(value) => {
                // this.saveResult(value);
            }}
            saveData ={(value) => {
                this.saveResult(value);
            }
            }
            state = {{}}
        />,
        <SelectedInputBean
            id = 'isReview'
            label='是否需要审批'
            isNeed={true}
            defaultValue = {["1"]}
            data={BaseFormData.isReview}
            onSelectedChange={(value) => {
                // this.onFormDataChange(value.toString())
                // this.saveResult(value);
            }}
            state = {{}}
            saveData ={(value) => {
                this.saveResult(value);
                this.setControllerValue("isReview",value.value == 1);
            }
            }
        />,
        <WorkFlowInputBean
            id ='workName'
            label='工作流名称'
            defaultValue = {[]}
            isNeed={true}
            controlled={["isReview","data"]}
            transformer = {{"isReview":"isShow","data":"data"}}
            setHandler = {this.setHandler}
            controller={this.controller}
            onSelectedChange={(value) => {
                // this.onFormDataChange(value.toString())
                // this.saveResult(value);
            }}
            saveData ={(value) => {
                this.saveResult(value);
            }
            }
            state = {{}}
        />,
        <StringInputBean
            id='contacts'
            label='联系人'
            isNeed={true}
            placeholder='请填写联系人'
            onChange={(itemResult) => {
                this.saveResult(itemResult);
            }}
            state = {{}}
        />,
        <StringInputBean
            id='telephone'
            label='联系人电话'
            type='number'
            isNeed={true}
            placeholder='请填写联系人电话'
            onChange={(itemResult) => {
                this.saveResult(itemResult);
            }}
            state = {{}}
        />,
        <StringInputBean
            id='goodsName'
            label='品名'
            isNeed={false}
            placeholder='请填写品名'
            onChange={(itemResult) => {
                this.saveResult(itemResult);
            }}
            state = {{}}
        />,
        <StringInputBean
            id='specifications'
            label='规格'
            isNeed={false}
            placeholder='请填写规格'
            onChange={(itemResult) => {
                this.saveResult(itemResult);
            }}
            state = {{}}
        />,
        <StringInputBean
            id='goodsCount'
            label='货物数量'
            type = 'number'
            isNeed={false}
            placeholder='请填写货物数量'
            onChange={(itemResult) => {
                this.saveResult(itemResult);
            }}
            state = {{}}
        />,
        <StringInputBean
            id='accompanyPerson'
            label='申请单位'
            isNeed={false}
            placeholder='请填写申请单位'
            onChange={(itemResult) => {
                this.saveResult(itemResult);
            }}
            state = {{}}
        />,
        <DateInputBean
            id='startTime'
            label='出发时间'
            isNeed={true}
            placeholder='请选择出发时间'
            onChange={(value) => {
                this.saveResult(value);
            }}
            state = {{}}
        />,
        <SelectedInputBean
            id='startType'
            label='时间类型'
            defaultValue = {["1"]}
            isNeed={true}
            data={BaseFormData.timeType}
            placeholder='请选择'
            onSelectedChange={(value) => {
                // this.saveResult(value);
            }}
            saveData ={(value) => {
                this.saveResult(value);
            }
            }
            state = {{}}
        />,
        <DateInputBean
            id='desTime'
            label='到达时间'
            isNeed={true}
            placeholder='请选择到达时间'
            onChange={(value) => {
                this.saveResult(value);
            }}
            state = {{}}
        />,
        <SelectedInputBean
            id='desType'
            label='时间类型'
            isNeed={true}
            defaultValue = {["1"]}
            data={BaseFormData.timeType}
            placeholder='请选择'
            onSelectedChange={(value) => {
                // this.saveResult(value);
            }}
            saveData ={(value) => {
                this.saveResult(value);
            }
            }
            state = {{}}
        />,
        <StringInputBean
            id='startPlace'
            label='起始地点'
            isNeed={true}
            placeholder='请填写起始地点'
            onChange={(itemResult) => {
                this.saveResult(itemResult);
            }}
            state = {{}}
        />,
        <LocationInputBean
            label='详细地址'
            isNeed={true}
            placeholder='请填写详细地址'
            onChange={(itemResult) => {
                this.saveResult(itemResult);
            }}
            id={['startAddress','startLongitude','startLatitude']}
            addressId = 'startAddress'
            saveLocation={
                (location) =>{
                    this.saveResult({id:"startLongitude",value:location.longitude});
                    this.saveResult({id:"startLatitude",value:location.latitude});
                }
            }
            state = {{}}
        />,
        <StringInputBean
            id='destination'
            label='目的地点'
            isNeed={true}
            placeholder='请填写目的地点'
            onChange={(itemResult) => {
                this.saveResult(itemResult);
            }}
            state = {{}}
        />,
        <LocationInputBean
            label='详细地址'
            isNeed={true}
            placeholder='请填写详细地址'
            onChange={(itemResult) => {
                this.saveResult(itemResult);
            }}
            id={['desAddress','desLongitude','desLatitude']}
            addressId = 'desAddress'
            saveLocation={
                (location) =>{
                    this.saveResult({id:"desLongitude",value:location.longitude});
                    this.saveResult({id:"desLatitude",value:location.latitude});
                }
            }
            state = {{}}
        />,
        <StringInputBean
            id='remark'
            label='备注'
            isNeed={false}
            placeholder='请填写备注'
            onChange={(itemResult) => {
                this.saveResult(itemResult);
            }}
            state = {{}}
        />,
        <CommitBean
            label='提交'
            onClick={
                () => {
                    this.onCommitData(this);
                }
            }
            controlled={["commit"]}
            transformer = {{"commit":"isShow"}}
            setHandler = {this.setHandler}
            controller={this.controller}
            saveData={(itemResult) => {
                this.saveResult(itemResult);
            }
            }
            state = {{}}
        />,
        <ImageInputBean
            label='图片'
            isShow={false}
            controlled={["showImg"]}
            transformer = {{"showImg":"isShow"}}
            setHandler = {this.setHandler}
            controller={this.controller}
            uploadPic = {
                ()=>{
                    return this.uploadPic();
                }
            }
            state = {{}}
        />

    ]
}

