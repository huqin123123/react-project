import React, { Component } from 'react';
import './userPresentation.css';
import {LocaleProvider, Button, Table, Pagination, Form, Input, Cascader, Divider, Dropdown, Icon, Menu, Modal, Row, Col, Radio } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const { TextArea } = Input;
const options = [{
    value: '已通过',
    label: '已通过'
}, {
    value: '未通过',
    label: '未通过'
}, {
    value: '待审核',
    label: '待审核'
}];

const data = [{
    key: '1',
    id: '1',
    time: '2018-04-05 10:15:25',
    realname: '王小明01',
    tel: '18213516200',
    reflectaccount: '100.00',
    state: '已通过',
}, {
    key: '2',
    id: '2',
    time: '2018-03-05 10:15:25',
    realname: '王小明02',
    tel: '18213516201',
    reflectaccount: '100.00',
    state: '未通过'
}, {
    key: '3',
    id: '3',
    time: '2018-02-05 10:15:25',
    realname: '王小明03',
    tel: '18213516202',
    reflectaccount: '100.00',
    state: '未通过'
}];
class UserPresentation extends Component {
    state = {
        visible1: false,
        visible2: false,
        confirmLoading: false,
    };
    showModal1 = () => {//审核
        this.setState({ visible1: true });
    }
    showModal2 = () => {//详情
        this.setState({ visible2: true });
    }
    handleOk = (e) => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible1: false,
                visible2: false,
                confirmLoading: false,
            });
        }, 2000);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        });
    }
    handleCancel = () => {
        this.setState({
            visible1: false,
            visible2: false,
        });
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.showModal1}>审核</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal2}>详情</a>
                </Menu.Item>
            </Menu>
        );
        const columns = [{
            title: '序号',
            dataIndex: 'id'
        }, {
            title: '提现时间',
            dataIndex: 'time',
        }, {
            title: '真实姓名',
            dataIndex: 'realname',
        }, {
            title: '手机号',
            dataIndex: 'tel',
        }, {
            title: '体现金额',
            dataIndex: 'reflectaccount',
        }, {
            title: '审核状态',
            dataIndex: 'state',
        }, {
            title: '操作',
            dataIndex: 'options',
            render: text => (
                <Dropdown overlay={menu}>
                    <Button style={{ marginLeft: 8 }}>
                        操作 <Icon type="down" />
                    </Button>
                </Dropdown>
            )
        }];
        return (
            <div className="userPresentation">
                <Form
                    ref="form"
                    className="form"
                    onSubmit={this.handleSearch}
                >
                    <div className="al-center ">
                        <span className="text-right title-width4">客户经理：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`field-${1}`, {})(
                                <Input placeholder="请输入策略名称或ID" />
                            )}
                        </span>
                    </div>
                    <div className="al-center ">
                        <span className="text-right title-width">状态：</span>
                        <span className="input-width">
                            {getFieldDecorator(`field-${2}`, {})(
                                <Cascader options={options} placeholder="请选择" />
                            )}
                        </span>
                    </div>
                    <div className="strategy-form-Button">
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
                <Modal title="【真实姓名】体现审核"
                    visible={this.state.visible1}
                    onCancel={this.handleCancel}
                    okText="确认"
                    cancelText="取消"
                    width="740px"
                    destroyOnClose="true"
                >
                    <Form
                        ref="form"
                        className="flex-column"
                        onSubmit={this.handleOk}
                    >
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="体现时间："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="体现金额："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="真实姓名："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="手机号："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="体现银行："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="银行卡号："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="开户地址："
                                >
                                    <TextArea rows={4} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="备注："
                                >
                                    <TextArea rows={4} disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="审核："
                                >
                                    <Radio.Group style={{ paddingTop: 8 }}>
                                        <Radio value={1}>通过</Radio>
                                        <Radio value={2}>不通过</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="原因："
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal title="【真实姓名】体现审核"
                    visible={this.state.visible2}
                    onCancel={this.handleCancel}
                    okText="保存"
                    cancelText="取消"
                    width="740px"
                    destroyOnClose="true"
                >
                    <Form
                        ref="form"
                        className="flex-column"
                        onSubmit={this.handleOk}
                    >
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="体现时间："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="体现金额："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="真实姓名："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="手机号："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="体现银行："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="银行卡号："
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="开户地址："
                                >
                                    <TextArea rows={4} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="备注："
                                >
                                    <TextArea rows={4} disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(UserPresentation);


