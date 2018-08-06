import React, { Component } from 'react';
import './userData.css';
import {LocaleProvider, Button, Table, Pagination, Form, Input, Divider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ServerHandle from '../../../utils/ApiHandle';
import $ from 'jquery';


class UserData extends Component {
    constructor(props){
        super(props);
        this.userData=this.userData.bind(this);
        this.handleSearch=this.handleSearch.bind(this);
        this.handleReset=this.handleReset.bind(this);
        this.numChange=this.numChange.bind(this);
        this.sizeChange=this.sizeChange.bind(this);
        this.state={
            num:1,
            size:20,
            dataList:[],
            count:0,
            userData:[],
            // count:0,
        }
    }
    componentDidMount(){
        this.userData();
        this.dataList();
    }
    /**
     * 用户数据统计
     */
    userData(){
        ServerHandle.GET({
            url:'/web/statistics/customers'
        }).then(result=>{
            if(result.success){
                this.setState({userData:result.data});
             }
        });
    }
    dataList(){
        let manager=$("#manager").val();
        ServerHandle.GET({
            url:'/web/statistics/list',
            data:{
                pageNum:this.state.num,
                paheSize:this.state.size,
                content:manager
            }
        }).then(result=>{
            if(result.success){
                this.setState({dataList:result.data,count:result.count});
            }
        })
    }
    numChange(page,pageSize){
        this.setState({
            num: page,
            size: pageSize,
        }, () => { this.dataList()});
    }
    sizeChange(current,size){
        this.setState({
            num: current,
            size: size,
        }, () => {this.dataList()});
    }
    handleSearch(){
        this.dataList();
    }
    handleReset = () => {
        this.props.form.resetFields();
        this.dataList();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {num,size,count,userData,dataList}=this.state;
        const columns = [{
                title: '序号',
                key: 'number',
                render:(text,item,key)=>{
                    return key+1
                }
            }, {
                title: '真实姓名',
                key: 'realname',
                render:text=>{
                    return text.realName
                }
            }, {
                title: '手机号',
                key: 'telphone ',
                render:text=>{
                    return text.telphone 
                }
            }, {
                title: '今日客户经理',
                key: 'addManagerNum ',
                render:text=>{
                    return text.addManagerNum 
                }
            }, {
                title: '客户经理总量',
                key: 'allManagerNum ',
                render:text=>{
                    return text.allManagerNum 
                }
            }, {
                title: '今日客户',
                key: 'addCustomerNum',
                render:text=>{
                    return text.addCustomerNum
                }
            }, {
                title: '客户总量',
                key: 'cumstomerNum',
                render:text=>{
                    return text.cumstomerNum
                }
            }, {
                title: '今日VIP',
                key: 'addVIPNum ',
                render:text=>{
                    return text.addVIPNum 
                }
            }, {
                title: 'VIP总量',
                key: 'vipNum',
                render:text=>{
                    return text.vipNum
                }
            }, {
                title: '微信总量',
                key: 'openNum  ',
                render:text=>{
                    return text.openNum  
                }
            }, {
                title: '今日关注',
                key: 'addAttentionNum ',
                render:text=>{
                    return text.addAttentionNum 
                }
            }, {
                title: '今日取关',
                key: 'cancelAttentionNum ',
                render:text=>{
                    return text.cancelAttentionNum 
                }
            }, {
                title: '取关总量',
                key: 'cancelOpenNum ',
                render:text=>{
                    return text.cancelOpenNum 
                }
        }];
        return (
            <div className="userData">
                <div className="userData-detail">
                    <table className="userData-table">
                        <tbody  >
                            <tr className="number" cellSpacing="70">
                                <th rowSpan="2">客户统计：</th>
                                <td>{userData.allCustomerNum}</td>
                                <td>{userData.todayAddCustomerNum }</td>
                                <td>{userData.weekAddCustomerNum }</td>
                                <td>{userData.monthAddCustomerNum }</td>
                            </tr>
                            <tr className="title">
                                <td>客户总量</td>
                                <td>今日新增</td>
                                <td>本周新增</td>
                                <td>本月新增</td>
                            </tr>
                            <tr className="number space">
                                <th rowSpan="2">VIP统计：</th>
                                <td>{userData.allCustomerNumVIP }</td>
                                <td>{userData.todayAddCustomerNumVIP }</td>
                                <td>{userData.weekAddCustomerNumVIP }</td>
                                <td>{userData.monthAddCustomerNumVIP }</td>
                            </tr>
                            <tr className="title">
                                <td>VIP总量</td>
                                <td>今日新增</td>
                                <td>本周新增</td>
                                <td>本月新增</td>
                            </tr>
                            <tr className="number space">
                                <th rowSpan="2">机构统计：</th>
                                <td>{userData.allManagerNum }</td>
                                <td>{userData.todayAddManagerNum }</td>
                                <td>{userData.weekAddManagerNum }</td>
                                <td>{userData.monthAddMangerNum}</td>
                            </tr>
                            <tr className="title">
                                <td>客户经理总量</td>
                                <td>今日新增</td>
                                <td>本周新增</td>
                                <td>本月新增</td>
                            </tr>
                            <tr className="number space">
                                <th rowSpan="2">微信统计：</th>
                                <td>{userData.allWechaterNum }</td>
                                <td>{userData.todayAddWechaterNum}</td>
                                <td>{userData.weekAddWechaterNum }</td>
                                <td>{userData.monthAddWechaterNum }</td>
                            </tr>
                            <tr className="title">
                                <td>微信用户总量</td>
                                <td>今日新增</td>
                                <td>本周新增</td>
                                <td>本月新增</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <Form
                    ref="form"
                    className="RoleManage-form formdiv"
                >
                    <div className="RoleManage-form-input flex-row flex al-center ">
                        <span className="text-right title-width4">客户经理：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`manager`, {})(
                                <Input placeholder="请输入真实姓名、手机号" />
                            )}
                        </span>
                    </div>
                    <div className="RoleManage-form-Button flex">
                        <Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    </div>
                </Form>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <div className="tableList">
                    <Table rowKey="id" pagination={false} columns={columns} dataSource={dataList} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共 {count}条记录 第 {num} / {Math.ceil(count/size)} 页</span>
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
export default Form.create()(UserData);


