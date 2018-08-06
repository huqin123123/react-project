import React, { Component } from 'react';
import './myAccount.css';
import { LocaleProvider, Button, Table, Pagination, Form, Input, DatePicker, Divider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const columns = [{
    title: '序号',
    dataIndex: 'id'
}, {
    title: '流水时间',
    dataIndex: 'time',
}, {
    title: '流水单号',
    dataIndex: 'number',
}, {
    title: '客户姓名',
    dataIndex: 'name',
}, {
    title: '客户手机号',
    dataIndex: 'tel',
}, {
    title: '消费余额',
    dataIndex: 'consumptionbalance',
}, {
    title: '账户余额',
    dataIndex: 'accountbalance',
}, {
    title: '备注',
    dataIndex: 'remark',
}];
const data = [{
    key: '1',
    id: '1',
    time: '2018-04-05 10:15:25',
    number: 'PO1000000001',
    name: '王小明01',
    tel: '18213516200',
    consumptionbalance: '300.00',
    accountbalance: '1000.00',
    remark: '订阅1月VIP',
}, {
    key: '2',
    id: '2',
    time: '2018-03-05 10:15:25',
    number: 'PO1000000002',
    name: '王小明02',
    tel: '18213516201',
    consumptionbalance: '300.00',
    accountbalance: '1000.00',
    remark: '订阅1月VIP',
}, {
    key: '3',
    id: '3',
    time: '2018-02-05 10:15:25',
    number: 'PO1000000001',
    name: '王小明03',
    tel: '18213516202',
    consumptionbalance: '300.00',
    accountbalance: '1000.00',
    remark: '订阅1月VIP',
}];

class MyAccount extends Component {
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
    };
    /**
     * disabledDate约束开始和结束时间
     */
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }
    onStartChange = (value) => {
        this.onChange('startValue', value);
    }

    onEndChange = (value) => {
        this.onChange('endValue', value);
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }

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
        const { startValue, endValue, endOpen, } = this.state;
        return (
            <div className="myAccount">
                <div className="myAccount-detail">
                    <i>【员工姓名】账户流水详情</i>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                    <table className="myAccount-table">
                        <tbody>
                            <tr className="myAccount-table-data">
                                <td>￥1000.00</td>
                                <td>￥8000.00</td>
                                <td>￥8000.00</td>
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
                    className="formdiv"
                    onSubmit={this.handleSearch}
                >
                    <div className="al-center flex flex-row ">
                        <span className="text-right title-width4">流水单号：</span>
                        <span className="input-width">
                            {getFieldDecorator(`field-${1}`, {})(
                                <Input placeholder="请输入" />
                            )}
                        </span>
                    </div>
                    <div className="al-center flex flex-row ">
                        <span className="text-right title-width">客户：</span>
                        <span className="input-width">
                            {getFieldDecorator(`field-${2}`, {})(
                                <Input placeholder="请输入客户姓名、手机号" />
                            )}
                        </span>
                    </div>
                    <div className="al-center flex-row  ">
                        <span className="text-right title-width">流水日期：</span>
                        <span>
                            <DatePicker
                                disabledDate={this.disabledStartDate}
                                format="YYYY-MM-DD"
                                value={startValue}
                                placeholder="请输入"
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}

                            />-
                                <DatePicker
                                disabledDate={this.disabledEndDate}
                                format="YYYY-MM-DD "
                                value={endValue}
                                placeholder="请输入"
                                onChange={this.onEndChange}
                                open={endOpen}
                                onOpenChange={this.handleEndOpenChange}

                            />
                        </span>
                    </div>
                    <div className=" flex text-center">
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
export default Form.create()(MyAccount);


