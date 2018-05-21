import React, { Component } from 'react';
import './customerViewpoint.css';
import { Icon, Button, Table, Pagination, Form, Input, Cascader, DatePicker, Menu, Dropdown,Modal } from 'antd';
const option = [{
    value: '已冻结',
    label: '已冻结'
}, {
    value: '正常',
    label: '正常'
}];
const data = [{
    key: '1',
    id: '1',
    time: '2018-04-05 10:15:25',
    publisher: '王**(189**1635)',
    title: '4月19日热点前瞻',
    state: '已冻结',
}, {
    key: '2',
    id: '2',
    time: '2018-04-05 10:15:25',
    publisher: '王**(189**1635)',
    title: '4月18日热点前瞻',
    state: '正常',
}, {
    key: '3',
    id: '3',
    time: '2018-02-05 10:15:25',
    publisher: '王**(189**1635)',
    title: '4月17日前瞻',
    state: '正常',
}];
class CustomerViewpoint extends Component {
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
        visible:false
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
            startValue:null,
            endValue:null,
        });
    }
    showModal = () => {//冻结/解冻
        this.setState({ visible: true });
    }
    handleOk = (e) => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { startValue, endValue, endOpen,confirmLoading,visible } = this.state;
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.showModal}>冻结/解冻</a>
                </Menu.Item>
            </Menu>
        );
        const columns = [{
            title: '序号',
            dataIndex: 'id'
        }, {
            title: '发布时间',
            dataIndex: 'time',
        }, {
            title: '发布人',
            dataIndex: 'publisher',
        }, {
            title: '观点标题',
            dataIndex: 'title',
        }, {
            title: '冻结状态',
            dataIndex: 'state',
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: text => (
                <Dropdown overlay={menu}>
                    <a> <Icon type="menu-fold" style={{ fontSize: 15 }} /></a>
                </Dropdown>
            )
        }];
        return (
            <div className="customerViewpoint">
                <Form
                    ref="form"
                    className="flex-column"
                    onSubmit={this.handleSearch}
                >
                    <div className=" formdiv ">
                        <div className=" al-center  list-width">
                            <span className="text-right title-width">发布人：</span>
                            <span className="input-width">
                                {getFieldDecorator(`field-${1}`, {})(
                                    <Input placeholder="请输入手机号或姓名" />
                                )}
                            </span>
                        </div>
                        <div className="input-data flex">
                            <span className="text-right title-width">发布日期：</span>
                            <span>
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    format="YYYY-MM-DD"
                                    value={startValue}
                                    placeholder="Start"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                    className="input-width"
                                />-
                                            <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    format="YYYY-MM-DD "
                                    value={endValue}
                                    placeholder="End"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                    className="input-width"
                                />
                            </span>
                        </div>
                    </div>
                    <div className="formdiv form-row">
                        <div className="input al-center list-width">
                            <span className="text-right title-width">状态：</span>
                            <span className="input-width">
                                {getFieldDecorator(`field-${3}`, {})(
                                    <Cascader options={option} placeholder="请选择" />
                                )}
                            </span>
                        </div>
                        <div className=" flex text-right">
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </div>
                    </div>
                </Form>
                <div className="tableList">
                    <Table pagination={false} columns={columns} dataSource={data} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共 400 条记录 第 1 / 80 页</span>
                    <span className="Pagination text-right">
                        <Pagination total={50} showSizeChanger showQuickJumper hideOnSinglePage />
                    </span>
                </div>
                <Modal title="【观点标题】冻结解冻操作"
                    visible={visible}
                    onOk={this.handleOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认冻结/解冻投顾观点？</p>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(CustomerViewpoint);


