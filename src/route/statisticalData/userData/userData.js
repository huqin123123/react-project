import React, { Component } from 'react';
import './userData.css';
import {LocaleProvider, Button, Table, Pagination, Form, Input, Divider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const data = [{
    key: '1',
    id: '1',
    realname: '王小明01',
    tel: '18213516200',
    manager: '100',
    total: '1000',
    customer: '500',
    customertotal: '5000',
    todayVIP: '100',
    VIPtotal: '1000',
    wxtotal: '5000',
    follow: '100',
    cancel: '50',
    canceltotal: '600'
}, {
    key: '2',
    id: '2',
    realname: '王小明02',
    tel: '18213516201',
    manager: '100',
    total: '1000',
    customer: '500',
    customertotal: '5000',
    todayVIP: '100',
    VIPtotal: '1000',
    wxtotal: '5000',
    follow: '100',
    cancel: '50',
    canceltotal: '600'
}, {
    key: '3',
    id: '3',
    realname: '王小明03',
    tel: '18213516202',
    manager: '100',
    total: '1000',
    customer: '500',
    customertotal: '5000',
    todayVIP: '100',
    VIPtotal: '1000',
    wxtotal: '5000',
    follow: '100',
    cancel: '50',
    canceltotal: '600'
}];
const columns = [{
    title: '序号',
    dataIndex: 'id'
}, {
    title: '真实姓名',
    dataIndex: 'realname',
}, {
    title: '手机号',
    dataIndex: 'tel',
}, {
    title: '今日客户经理',
    dataIndex: 'manager',
}, {
    title: '客户经理总量',
    dataIndex: 'total',
}, {
    title: '今日客户',
    dataIndex: 'customer',
}, {
    title: '客户总量',
    dataIndex: 'customertotal',
}, {
    title: '今日VIP',
    dataIndex: 'todayVIP',
}, {
    title: 'VIP总量',
    dataIndex: 'VIPtotal',
}, {
    title: '微信总量',
    dataIndex: 'wxtotal',
}, {
    title: '今日关注',
    dataIndex: 'follow',
}, {
    title: '今日取关',
    dataIndex: 'cancel',
}, {
    title: '取关总量',
    dataIndex: 'canceltotal',
}];
class UserData extends Component {
    state = {
    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
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

        return (
            <div className="userData">
                <div className="userData-detail">
                    <table className="userData-table">
                        <tbody  >
                            <tr className="number" cellSpacing="70">
                                <th rowSpan="2">客户统计：</th>
                                <td>10000000</td>
                                <td>800</td>
                                <td>10000</td>
                                <td>20000</td>
                            </tr>
                            <tr className="title">
                                <td>客户总量</td>
                                <td>今日新增</td>
                                <td>本周新增</td>
                                <td>本月新增</td>
                            </tr>
                            <tr className="number space">
                                <th rowSpan="2">VIP统计：</th>
                                <td>10000000</td>
                                <td>800</td>
                                <td>10000</td>
                                <td>20000</td>
                            </tr>
                            <tr className="title">
                                <td>VIP总量</td>
                                <td>今日新增</td>
                                <td>本周新增</td>
                                <td>本月新增</td>
                            </tr>
                            <tr className="number space">
                                <th rowSpan="2">机构统计：</th>
                                <td>10000000</td>
                                <td>800</td>
                                <td>10000</td>
                                <td>20000</td>
                            </tr>
                            <tr className="title">
                                <td>客户经理总量</td>
                                <td>今日新增</td>
                                <td>本周新增</td>
                                <td>本月新增</td>
                            </tr>
                            <tr className="number space">
                                <th rowSpan="2">微信统计：</th>
                                <td>10000000</td>
                                <td>800</td>
                                <td>10000</td>
                                <td>20000</td>
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
                    onSubmit={this.handleSearch}
                >
                    <div className="RoleManage-form-input flex-row al-center ">
                        <span className="text-right title-width4">客户经理：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`field-${1}`, {})(
                                <Input placeholder="请输入真实姓名、手机号" />
                            )}
                        </span>
                    </div>
                    <div className="RoleManage-form-Button flex">
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    </div>
                </Form>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <div className="tableList">
                    <Table pagination={false} columns={columns} dataSource={data} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共 400 条记录 第 1 / 80 页</span>
                    <span className="Pagination text-right">
                        <LocaleProvider locale={zhCN}>
                            <Pagination total={50} showSizeChanger showQuickJumper hideOnSinglePage defaultCurrent={1} />
                        </LocaleProvider>
                    </span>
                </div>
            </div>
        );
    }
}
export default Form.create()(UserData);


