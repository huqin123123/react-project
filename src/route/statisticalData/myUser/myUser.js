import React, { Component } from 'react';
import './myUser.css';
import { LocaleProvider, Button, Table, Pagination, Form, Input, Divider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ServerHandle from '../../../utils/ApiHandle';
import $ from 'jquery';

class MyUser extends Component {
    constructor(props){
        super(props);
        this.handleSearch=this.handleSearch.bind(this);
        this.handleReset=this.handleReset.bind(this);
        this.dataList=this.dataList.bind(this);
        this.statisticsData=this.statisticsData.bind(this);
        this.numChange=this.numChange.bind(this);
        this.sizeChange=this.sizeChange.bind(this);
        this.state = {
            num:1,
            size:20,
            statisticsData:[],//统计数据
            dataList:[],
            count:0,
        }
    }
    componentDidMount(){
        this.statisticsData();
        this.dataList();
    }
    /**
     * 统计数据
     */
    statisticsData(){
        ServerHandle.GET({
            url:'/web/statisticsByUser/customers',
        }).then(result=>{
            if(result.success){
               this.setState({statisticsData:result.data});
            }
        })
    }
    dataList(){
        let manager=$("#manager").val();
        ServerHandle.GET({
            url:'/web/statisticsByUser/list',
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
    handleSearch() {
        this.dataList();
    }
    handleReset(){
        this.props.form.resetFields();
        this.dataList();
      
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {count,size,num,dataList,statisticsData}=this.state;
        const columns = [{
                title: '序号',
                key: 'number',
                render:(text,item,key)=>{
                    return key+1
                }
            }, {
                title: '真实姓名',
                key: 'realName',
                render:text=>{
                    return text.realName
                }
            }, {
                title: '手机号',
                key: 'telphone',
                render:text=>{
                    return text.telphone
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
                key: 'addVIPNum',
                render:text=>{
                    return text.addVIPNum 
                }
            }, {
                title: 'VIP总量',
                key: 'vipNum ',
                render:text=>{
                    return text.vipNum 
                }
            }, {
                title: '微信总量',
                key: 'openNum ',
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
            <div className="myUser">
                <div className="myUser-detail">
                    <table className="myUser-table">
                        <tbody  >
                            <tr className="number" cellSpacing="70">
                                <th rowSpan="2">客户统计：</th>
                                <td>{statisticsData.allCustomerNum}</td>
                                <td>{statisticsData.todayAddCustomerNum}</td>
                                <td>{statisticsData.weekAddCustomerNum}</td>
                                <td>{statisticsData.monthAddCustomerNum}</td>
                            </tr>
                            <tr className="title">
                                <td>客户总量</td>
                                <td>今日新增</td>
                                <td>本周新增</td>
                                <td>本月新增</td>
                            </tr>
                            <tr className="number space">
                                <th rowSpan="2">VIP统计：</th>
                                <td>{statisticsData.allCustomerNumVIP}</td>
                                <td>{statisticsData.todayAddCustomerNumVIP }</td>
                                <td>{statisticsData.weekAddCustomerNumVIP }</td>
                                <td>{statisticsData.monthAddCustomerNumVIP }</td>
                            </tr>
                            <tr className="title">
                                <td>VIP总量</td>
                                <td>今日新增</td>
                                <td>本周新增</td>
                                <td>本月新增</td>
                            </tr>
                            <tr className="number space">
                                <th rowSpan="2">机构统计：</th>
                                <td>{statisticsData.allManagerNum }</td>
                                <td>{statisticsData.todayAddManagerNum }</td>
                                <td>{statisticsData.weekAddManagerNum }</td>
                                <td>{statisticsData.monthAddMangerNum}</td>
                            </tr>
                            <tr className="title">
                                <td>客户经理总量</td>
                                <td>今日新增</td>
                                <td>本周新增</td>
                                <td>本月新增</td>
                            </tr>
                            <tr className="number space">
                                <th rowSpan="2">微信统计：</th>
                                <td>{statisticsData.allWechaterNum }</td>
                                <td>{statisticsData.todayAddWechaterNum }</td>
                                <td>{statisticsData.weekAddWechaterNum }</td>
                                <td>{statisticsData.monthAddWechaterNum }</td>
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
            </div>
        );
    }
}
export default Form.create()(MyUser);


