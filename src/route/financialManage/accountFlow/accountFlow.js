

import React, { Component } from 'react';
import './accountFlow.css';
import { LocaleProvider, Button, Table, Pagination, Form, Input, Divider, DatePicker } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ServerHandle from '../../../utils/ApiHandle';
import $ from 'jquery';


class AccountFlow extends Component {
    constructor(props){
        super(props);
        this.handleQuery=this.handleQuery.bind(this);
        this.dataList=this.dataList.bind(this);
        this.sizeChange=this.sizeChange.bind(this);
        this.numChange=this.numChange.bind(this);
        this.state={
            count:0,
            size:20,
            num:1,
            dataList:[],
        }
    }
    componentDidMount(){
        this.dataList();
    }
    dataList(){
        let flowNo=$("#flowNo").val();
        let start=$("#createTimeStart input").val();
        let end=$("#createTimeEnd input").val();
        let customer=$("#customer").val();
        let manager=$("#manager").val();
        let userName=$("#userName").val();
        ServerHandle.GET({
            url:'/web/account/list/list',
            data:{
                pageNum:this.state.num,
                pageSize:this.state.size,
                flowNo:flowNo,
                customerTelphone:customer,
                createTimeStart:start,
                createTimeEnd:end,
                managerMsg:manager,
                userMsg:userName,
            }
        }).then(result=>{
            if(result.success){
                console.log(result)
                this.setState({
                    dataList:result.data,
                    count:result.count,
                })
            }
        })
    }
    numChange(page,pageSize){
        this.setState({num:page,size:pageSize},()=>{
            this.dataList();
        })
    }
    sizeChange(current,size){
        this.setState({num:current,size:size},()=>{
            this.dataList();
        })
    }
    handleQuery (){
      this.dataList()
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {count,dataList,size,num } = this.state;
        const columns = [{
                title: '序号',
                key: 'number',
                render:(text,item,key)=>{
                    return key+1
                }
            }, {
                title: '流水时间',
                dataIndex: 'createTime',
            }, {
                title: '流水单号',
                dataIndex: 'flowNo',
            }, {
                title: '客户手机号',
                key: 'customerTelphone',
                render:text=>{
                    return text.customerTelphone || '-'
                }
            }, {
                title: '消费金额（￥）',
                dataIndex: 'price',
            }, {
                title: '客户经理ID',
                key: 'idCode' ,
                render:text=>{
                    return text.idCode || '-'
                }
            }, {
                title: '客户经理余额（￥）',
                key: 'managerBalance',
                render:text=>{
                    return text.managerBalance || '-'
                }
            }, {
                title: '维护人员工号',
                key: 'employeeID',
                render:text=>{
                    return text.employeeID || '-'
                }
            }, {
                title: '维护人员余额（￥）',
                key: 'userBalance',
                render:text=>{
                    return text.userBalance || '-'
                }
            }, {
                title: 'AQ分成（￥）',
                key: 'aqDivide',
                render:text=>{
                    return text.aqDivide || '-'
                }
            }, {
                title: '备注',
                key: 'remark',
                render:text=>{
                    return text.remark || '无'
                }
    }];
        return (
            <div className="customerViewpoint">
                <Form
                    ref="form"
                    className="flex-column"
                    onSubmit={this.handleSearch}
                    >
                    <div className=" formdiv formspace">
                        <div className="al-center flex flex-row ">
                            <span className="text-right title-width4">客户经理：</span>
                            <span className="input-width">
                                {getFieldDecorator(`manager`, {})(
                                    <Input placeholder="请输入" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex flex-row ">
                            <span className="text-right title-width4">维护人员：</span>
                            <span className="input-width">
                                {getFieldDecorator(`userName`, {})(
                                    <Input placeholder="请输入工号" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex flex-row ">
                            <span className="text-left">客户：</span>
                            <span className="input-width">
                                {getFieldDecorator(`customer`, {})(
                                    <Input placeholder="请输入手机号" />
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="formdiv">
                        <div className="al-center flex flex-row ">
                            <span className="text-right title-width4">流水单号：</span>
                            <span className="input-width">
                                {getFieldDecorator(`flowNo`, {})(
                                    <Input placeholder="请输入手机号" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex-row flex">
                            <span className="text-right title-width4">流水日期：</span>
                            <span className="flex picker-width account">
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
                        <div className=" flex  flex-row">
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
                    <span className="total">共{count}条记录 第{num}/{Math.ceil(count/size)}页</span>
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
            </div>
        );
    }
}
export default Form.create()(AccountFlow);


