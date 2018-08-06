import React, { Component } from 'react';
import './myAccount.css';
import { LocaleProvider, Button, Table, Pagination, Form, Input, DatePicker, Divider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ServerHandle from '../../../utils/ApiHandle';
import $ from 'jquery';


class MyAccount extends Component {
    constructor(props){
        super(props);
        this.handleQuery=this.handleQuery.bind(this);
        this.accountFlow=this.accountFlow.bind(this);
        this.dataList=this.dataList.bind(this);
        this.numChange=this.numChange.bind(this);
        this.sizeChange=this.sizeChange.bind(this);
        this.state={
            num:1,
            size:20,
            dataList:[],
            count:0,
            userAccount:[],//员工账户流水详情
        }
    }
    componentDidMount(){
        this.accountFlow();
        this.dataList();
    }
    accountFlow(){
        ServerHandle.GET({
            url:'/web/account/balance',
            data:{}
        }).then(result=>{
            this.setState({userAccount:result.data})
        })
    }
    dataList(){
        let flowNo=$("#oddNumbers").val();
        let customer=$("#customer").val();
        let start=$(".financeMange #createTimeStart input").val();
        let end=$(".financeMange #createTimeEnd  input").val();
        ServerHandle.GET({
            url:'/web/account/list',
            data:{
                pageNum:this.state.num,
                pageSize:this.state.size,
                flowNo:flowNo,
                createTimeStart:start,
                createTimeEnd:end,
                customerMsg:customer,
            }
        }).then(result=>{
            if(result.success){
                console.log(result)
                this.setState({count:result.count,dataList:result.data})
            }
        });
    }
    handleQuery(){
        this.dataList();
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
    handleReset = () => {
        this.props.form.resetFields();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { num,size,count,dataList,userAccount } = this.state;
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
                title: '客户姓名',
                key:'name',
                render:text=>{
                    return text.name
                }
            }, {
                title: '客户手机号',
                key: 'customerTelphone',
                render:text=>{
                    return text.customerTelphone|| '无'
                }
            }, {
                title: '消费金额',
                key: 'price',
                render:text=>{
                    return text.price || '无'
                }
            }, {
                title: '账户余额',
                dataIndex: 'userBalance',
            }, {
                title: '备注',
                dataIndex: 'remark',
    }];
        return (
            <div className="myAccount">
                <div className="myAccount-detail">
                    <i>{'【'+userAccount.userName+'】账户流水详情'}</i>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                    <table className="myAccount-table" >
                        <tbody>
                            <tr className="myAccount-table-data">
                                <td>￥{userAccount.money }</td>
                                <td>￥{userAccount.totalRevenue }</td>
                                <td>￥{userAccount.totalSettlement }</td>
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
                                {getFieldDecorator(`oddNumbers`, {})(
                                    <Input placeholder="请输入" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex flex-row ">
                            <span className="text-right title-width">客户：</span>
                            <span className="input-width">
                                {getFieldDecorator(`customer`, {})(
                                    <Input placeholder="请输入客户姓名、手机号" />
                                )}
                            </span>
                        </div>
                    </div>
                    <div className=" formdiv ">
                        <div className="al-center flex-row flex ">
                            <span className="text-right title-width4">流水日期：</span>
                            <span className="flex picker-widthTwo financeMange">
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
                        <div className="flex">
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
export default Form.create()(MyAccount);


