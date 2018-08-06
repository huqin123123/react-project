import React, { Component } from 'react';
import {LocaleProvider, Button, Divider, Input, Modal, Form, Cascader, Icon, Table, Pagination, Menu, Dropdown } from 'antd';
import './versionManagement.css';
import zhCN from 'antd/lib/locale-provider/zh_CN';
//版本管理
const { TextArea } = Input;
const options = [{
    value: 'Android',
    label: 'Android'
}, {
    value: 'IOS',
    label: 'IOS'
}, {
    value: 'PC',
    label: 'PC'
}];
const data = [{
    key: '1',
    id: '1',
    num: '2.1.1',
    name: '11',
    terminal: 'Android',
    time: '2018-04-05 10:15:25',
    state: '未发布',
}, {
    key: '2',
    id: '2',
    num: '2.1.1',
    name: '11',
    terminal: 'IOS',
    time: '2018-04-05 10:15:25',
    state: '已发布',
}, {
    key: '3',
    id: '3',
    num: '2.1.1',
    name: '11',
    terminal: 'PC',
    time: '2018-04-05 10:15:25',
    state: '已发布',
}];
class VersionManagement extends Component {
    state = {
        visible1: false,
        visible2: false,
        visible3: false,
        confirmLoading: false,
    }
    showModal1 = () => {
        this.setState({
            visible1: true,
        });
    }
    showModal2 = () => {
        this.setState({
            visible2: true,
        });
    }
    showModal3 = () => {
        this.setState({
            visible3: true,
        });

    }
    handleOk = (e) => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible1: false,
                visible2: false,
                visible3: false,
                confirmLoading: false,
            });
        }, 2000);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    handleCancel = () => {
        this.setState({
            visible1: false,
            visible2: false,
            visible3: false,
        });
    }
    render() {
        const { confirmLoading } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.showModal2}>取消发布</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal3}>发布</a>
                </Menu.Item>
            </Menu>
        );
        const columns = [{
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '版本号',
            dataIndex: 'num',
            key: 'num',
        }, {
            title: '版本名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '终端',
            dataIndex: 'terminal',
            key: 'terminal',
        }, {
            title: '发布时间',
            dataIndex: 'time',
            key: 'time',
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: text => (
                <Dropdown overlay={menu}>
                    <Button style={{ marginLeft: 8 }}>
                        操作 <Icon type="down" />
                    </Button>
                </Dropdown>
            )
        }];
        return (
            <div className="VersionManagement">
                <div className="VersionManagement-query">
                    <Button type="primary" icon="plus" onClick={this.showModal1} className="primary-btn">添加版本</Button>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                </div>
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
                <Modal title="添加版本"
                    visible={this.state.visible1}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    destroyOnClose={true}
                >
                    <Form
                        ref="form"
                        className="flex-column"
                        onSubmit={this.handleOk}
                    >
                        <Form.Item
                            {...formItemLayout}
                            label="终端："
                        >
                            <Cascader options={options} placeholder="请选择" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="版本名："
                        >
                            {getFieldDecorator('version name', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="版本号："
                        >
                            {getFieldDecorator('version number', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />,
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="链接地址："
                        >
                            {getFieldDecorator('dress', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            label="备注："
                        >
                            <TextArea rows={4} placeholder="多行文本" />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="【终端：版本号】取消发布"
                    visible={this.state.visible2}
                    onOk={this.handleOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认取消发布版本？</p>
                </Modal>
                <Modal title="【终端：版本号】发布版本"
                    visible={this.state.visible3}
                    onOk={this.handleOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认发布此版本？</p>
                </Modal>
            </div >
        );
    }
}
export default Form.create()(VersionManagement);
