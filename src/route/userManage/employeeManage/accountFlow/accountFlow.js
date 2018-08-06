

import React, { Component } from 'react';
import {LocaleProvider, Button, Table, Pagination, Form, Input, Divider, DatePicker } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ServerHandle from '../../../../utils/ApiHandle';
import './accountFlow.css';
import $ from 'jquery';
class AccountFlow extends Component {
    constructor (props){
        super(props);
        this.Return=this.Return.bind(this);
        this.adminList=this.adminList.bind(this);
        this.numChange=this.numChange.bind(this);
        this.sizeChange=this.sizeChange.bind(this);
        this.handleQuery=this.handleQuery.bind(this);
        this.state={
            num:1,
            size:20,
            adminList:[],//员工列表
            count:0,
            accountId:0,//账户id(客户、客户经理、员工id)
            accountDetails:[],//账户流水详情
        }
    }
componentDidMount(){
    //账户流水，账户余额
    this.adminList();
        ServerHandle.GET({
            url:'/web/user/admin/balanceFlow/page',
            data:{accountId:this.props.location.state.id,userName:this.props.location.state.userName}
        }).then(result=>{
            this.setState({accountDetails:result.vo})
        });
}
adminList(){
    let customer =$("#customer").val();
    let flowNo=$("#oddNumber").val();
    let start=$("#createTimeStart input").val();
    let end=$("#createTimeEnd input").val();
    ServerHandle.POST({
        url:'/web/user/admin/balanceFlow/list',
        data:{
            pageNum:this.state.num,
            pageSize:this.state.size,
            accountId:this.state.accountId,
            flowNo:flowNo,//流水单号，
            createTimeStart:start,
            createTimeEnd:end,
            customerMsg:customer,
        }
    }).then(result=>{
        if(result.success){
            console.log(result)
            this.setState({adminList:result.data,count:result.count});
        }
    })
}
//分页
numChange(page, pageSize) {
    this.setState({
        num: page,
        size: pageSize,
    }, () => { this.adminList()})
}
sizeChange(current, size) {
    this.setState({
        num: current,
        size: size,
    }, () => {this.adminList()})
}
Return(){
  this.props.history.push('/index/employeeManage')
}
handleQuery(){
    this.adminList();
}
handleReset = () => {
    this.props.form.resetFields();
    this.setState({
        startValue: null,
        endValue: null,
    });
}
render() {
    const { getFieldDecorator } = this.props.form;
    const {adminList,count,num,size,accountDetails}=this.state;
    const columns = [{
            title: '序号',
            key: 'number',
            render:(text,item,key)=>{
                return key+1
            }
        }, {
            title: '流水时间',
            key: 'time',
            render:text=>{
                return text.createTime 
            }
        }, {
            title: '流水单号',
            key: 'numr',
            render:text=>{
                return text.flowNo 
            }
        }, {
            title: '客户姓名',
            key: 'naem',
            render :text=>{
                return text.name 
            }
        },{
            title: '客户手机号',
            key: 'telphone',
            render :text=>{
                return text.customerTelphone ||'-'
            }
        }, {
            title: '消费金额',
            key: 'consumption',
            render:text=>{
                return text.price || '无'
            }
        }, {
            title: '账户余额',
            key: 'balance',
            render:text=>{
                return text.userBalance || '0'     
            }
        },{
            title: '备注',
            key: 'remark',
            render:text=>{
                return text.remark || '无'
            }
    }];
    return (
        <div className="accountFlow">
            <div className="myAccount-detail">
                <i>{'['+this.props.location.state.userName+']'}账户流水详情</i>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <table className="myAccount-table" key="myAccount">
                    <tbody>
                        <tr className="myAccount-table-data">
                            <td>￥{accountDetails.money}</td>
                            <td>￥{accountDetails.totalRevenue}</td>
                            <td>￥{accountDetails.totalSettlement}</td>
                        </tr>
                        <tr className="myAccount-table-text">
                            <td>账户余额</td>
                            <td>累计进账</td>
                            <td>累计结算</td>
                        </tr>
                    </tbody>
                </table>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
            </div>
            <Form
                ref="form"
                className="flex-column"
                >
                <div className=" formdiv formspace">
                <div className="al-center flex flex-row ">
                        <span className="text-right title-width4">流水单号：</span>
                        <span className="input-width">
                            {getFieldDecorator(`oddNumber`, {})(
                                <Input placeholder="请输入" />
                            )}
                        </span>
                    </div>
                    <div className="al-center flex flex-row ">
                        <span className="text-right title-width4">客户：</span>
                        <span className="input-width">
                            {getFieldDecorator(`customer`, {})(
                                <Input placeholder="请输入客户姓名、手机号" />
                            )}
                        </span>
                    </div>
                </div>
                <div className=" formdiv">
                    <div className="al-center flex-row flex">
                        <span className="text-right title-width4">流水日期：</span>
                        <span className="flex picker-width">
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
                    <div className="flex  flex-row">
                        <Button type="primary" htmlType="submit" style={{marginLeft:30}} onClick={this.handleQuery}>查询</Button>
                        <Button style={{ marginLeft:8,marginRight:8 }} onClick={this.handleReset}>重置</Button>
                        <Button onClick={this.Return}>返回</Button>
                    </div>
                </div>
            </Form>
            <Divider style={{ marginTop: 15, marginBottom: 15 }} />
            <div className="tableList">
                <Table rowKey="id" pagination={false} columns={columns} dataSource={adminList} bordered />
            </div>
            <div className="Statistics">
                <span className="total">共 {count}条记录 第 {num} / {Math.ceil(count / size)}页</span>
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


