import React, { Component } from 'react';
import {LocaleProvider, Icon, Button, Table, Pagination, Form, Input, Cascader, DatePicker, Menu, Dropdown, Modal,Divider,message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './talentViewpoint.css'
import ServerHandle from '../../../utils/ApiHandle';
import $ from 'jquery';
const option = [{
        value: '已冻结',
        label: '已冻结'
    }, {
        value: '正常',
        label: '正常'
    }];
  
class TalentViewpoint extends Component {
    constructor(props){
        super(props);
        this.frozen=this.frozen.bind(this);
        this.dataList=this.dataList.bind(this);
        this.handleQuery=this.handleQuery.bind(this);
        this.sizeChange=this.sizeChange.bind(this);
        this.numChange=this.numChange.bind(this);
        this.handleFrozen=this.handleFrozen.bind(this);
        this.state={
            visible: false,
            num:1,
            size:20,
            count:0,
            dataList:[],
            adviserId:'',//达人观点id
            status:'',//冻结状态
            title:'',//观点标题
        }
    }
    componentDidMount(){
        this.dataList();
    }
    dataList(){
        let managerName=$("#managerName").val();
        let createTimeStart=$('#createTimeStart  input').val();
        let createTimeEnd= $('#createTimeEnd  input').val();
        let status =$(".talentViewpointStatus .ant-cascader-picker-label").text()
        ServerHandle.GET({
            url:'/web/consult/list',
            data:{
                pageNum:this.state.num,
                pageSize:this.state.size,
                isVisible:status==="正常"?1:(status==="已冻结"?2:''),//1正常2冻结
                createTimeStart:createTimeStart,
                createTimeEnd:createTimeEnd,
                queryName:managerName,//发布人
            }
        }).then(result=>{
            if(result.success){
               this.setState({dataList:result.data,count:result.count})
            }
        })
    }
    //分页
    numChange(page, pageSize) {
        this.setState({
            num: page,
            size: pageSize,
        }, () => { this.dataList()})
    }
    sizeChange(current, size) {
        this.setState({
            num: current,
            size: size,
        }, () => {this.dataList()})
    }
    handleQuery(){
        this.dataList();
    }
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({
            startValue: null,
            endValue: null,
        });
    }
    frozen(adviserId,isVisible,title){//冻结/解冻
        this.setState({ visible: true,adviserId:adviserId,status:isVisible,title:title });
    }
    handleFrozen() {
        ServerHandle.POST({
            url:'/web/consult/isVisible',
            data:{
                id:this.state.adviserId,
                isVisible:this.state.status===1?2:(this.state.status===2?1:'')
            }
        }).then(result=>{
            if(result.success){
                this.setState({
                    confirmLoading: true,
                },()=>{
                    setTimeout(() => {
                        this.setState({
                            visible: false,
                            confirmLoading: false,
                        },()=>{
                            message.success(this.state.status===1?'冻结成功':(this.state.status===2?'解冻成功':''))
                            this.dataList();
                        });
                    }, 2000);
                });
            }else{message.error(this.state.status===1?'冻结失败':(this.state.status===2?'解冻失败':''))}
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {confirmLoading, visible,num,size,count,dataList,title,status } = this.state;
        const columns = [{
                title: '序号',
                key: 'number',
                render:(text,item,key)=>{
                    return key+1
                }
            }, {
                title: '发布时间',
                key: 'createTime',
                render:text=>{
                    return text.createTime
                }
            }, {
                title: '发布人',
                key: 'managerName',
                render:text=>{
                    return text.managerName
                }
            }, {
                title: '观点标题',
                key: 'title',
                render:text=>{
                    return text.title 
                }
            }, {
                title: '冻结状态',
                key: 'state',
                render:text=>{
                    return text.isVisible===1?'正常':(text.isVisible===2?'已冻结':'-') 
                }
            }, {
                title: '操作',
                key: 'operation',
                render: text => (
                    <Dropdown overlay={
                        <Menu>
                        <Menu.Item onClick={()=>{this.frozen(text.id,text.isVisible,text.title)}}>
                        {text.isVisible===1?'冻结':(text.isVisible===2?'解冻':'')}
                        </Menu.Item>
                    </Menu>
                    }>
                        <Button style={{ marginLeft: 8 }}>
                            操作 <Icon type="down" />
                        </Button>
                    </Dropdown>
                )
        }];
        return (
            <div className="telentViewpoint">
                <Form
                    ref="form"
                    className="flex-column"
                    >
                    <div className="formdiv formspace">
                        <div className="al-center flex flex-row">
                            <span className="text-right title-width4">发布人：</span>
                            <span className="input-width">
                                {getFieldDecorator(`managerName`, {})(
                                    <Input placeholder="请输入手机号或姓名" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex2 flex-row ">
                            <span className="text-left title-width">发布日期：</span>
                                <span className="flex picker-widthTwo">
                                    <span>
                                        <LocaleProvider locale={zhCN} >
                                            {getFieldDecorator('createTimeStart', {})(
                                                <DatePicker />
                                            )}
                                        </LocaleProvider >-
                                        <LocaleProvider locale={zhCN} >
                                            {getFieldDecorator('createTimeEnd', {})(
                                                <DatePicker />
                                            )}
                                        </LocaleProvider >
                                    </span>
                                </span>
                        </div>
                    </div>
                    <div className="formdiv">
                    <div className="al-center flex flex-row ">
                            <span className="text-right title-width4">状态：</span>
                            <span className="input-width talentViewpointStatus">
                                {getFieldDecorator(`isVisible`, {})(
                                    <Cascader options={option} placeholder="请选择" />
                                )}
                            </span>
                        </div>
                        <div className=" flex2 text-left">
                            <Button type="primary" htmlType="submit" onClick={this.handleQuery}>查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </div>
                    </div>
                </Form>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <div className="tableList">
                    <Table rowKey="id" pagination={false} columns={columns} dataSource={dataList} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共 {count}条记录 第 {num} / {Math.ceil(count/size)}页</span>
                    <span className="Pagination text-right">
                    <LocaleProvider locale={zhCN}>
                        <Pagination 
                            total={count} 
                            showSizeChanger={true}
                            showQuickJumper={true}
                            hideOnSinglePage={false}
                            current={num}
                            pageSize={size}
                            onChange={this.numChange}
                            onShowSizeChange={this.sizeChange}
                           />
                    </LocaleProvider>
                    </span>
                </div>
                <Modal title={'['+title+']'+(status===1?'冻结':(status===2?'解冻':''))+'操作'}
                    visible={visible}
                    onOk={this.handleFrozen}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认{status===1?'冻结':(status===2?'解冻':'')}达人观点？</p>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(TalentViewpoint);


