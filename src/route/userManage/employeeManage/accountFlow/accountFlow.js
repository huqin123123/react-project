

import React, { Component } from 'react';
import {LocaleProvider, Button, Table, Pagination, Form, Input, Divider, DatePicker } from 'antd';
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
    title: '客户手机号',
    dataIndex: 'tel',
}, {
    title: '消费金额（￥）',
    dataIndex: 'consumption',
}, {
    title: '客户经理ID',
    dataIndex: 'managerID',
}, {
    title: '客户经理金额（￥）',
    dataIndex: 'manageraccount',
}, {
    title: '维护人员工号',
    dataIndex: 'maintainID',
}, {
    title: '维护人员金额（￥）',
    dataIndex: 'maintainaccount',
}, {
    title: 'AQ分成（￥）',
    dataIndex: 'divide',
}, {
    title: '备注',
    dataIndex: 'remark',
}
];
const data = [{
    key: '1',
    id: '1',
    time: '2018-04-05 10:15:25',
    number: 'PO1000000001',
    tel: '18213516200',
    consumption: '300.00',
    managerID: '2008000101',
    manageraccount: '250.00',
    maintainID: '3001',
    maintainaccount: '40.00',
    divide: '10.00',
    remark: '订阅1月VIP',

}, {
    key: '2',
    id: '2',
    time: '2018-03-05 10:15:25',
    number: 'PO1000000002',
    tel: '18213516201',
    consumption: '300.00',
    managerID: '2008000102',
    manageraccount: '250.00',
    maintainID: '3002',
    maintainaccount: '40.00',
    divide: '10.00',
    remark: '订阅1月VIP',
}, {
    key: '3',
    id: '3',
    time: '2018-02-05 10:15:25',
    number: 'PO1000000003',
    tel: '18213516202',
    consumption: '300.00',
    managerID: '2008000103',
    manageraccount: '250.00',
    maintainID: '3003',
    maintainaccount: '40.00',
    divide: '10.00',
    remark: '订阅1月VIP',
}];
class AccountFlow extends Component {
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
    };
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
                                {getFieldDecorator(`field-${1}`, {})(
                                    <Input placeholder="请输入" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex flex-row ">
                            <span className="text-right title-width4">维护人员：</span>
                            <span className="input-width">
                                {getFieldDecorator(`field-${2}`, {})(
                                    <Input placeholder="请输入工号" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex flex-row ">
                            <span className="text-left">客户：</span>
                            <span className="input-width">
                                {getFieldDecorator(`field-${3}`, {})(
                                    <Input placeholder="请输入手机号" />
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="formdiv">
                        <div className="al-center flex flex-row ">
                            <span className="text-right title-width4">流水单号：</span>
                            <span className="input-width">
                                {getFieldDecorator(`field-${4}`, {})(
                                    <Input placeholder="请输入手机号" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex-row flex">
                            <span className="text-right title-width4">流水日期：</span>
                            <span className="flex picker-width">
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
                            </span>
                        </div>
                        <div className=" flex  flex-row">
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </div>
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
export default Form.create()(AccountFlow);


