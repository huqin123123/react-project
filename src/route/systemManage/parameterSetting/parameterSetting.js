import React, { Component } from 'react';
import { Dropdown, Menu, Icon, Table, Form, Pagination, Modal, Input } from 'antd';
import './parameterSetting.css';
const { TextArea } = Input;
const data = [{
    key: '1',
    id: '1',
    name: 'VIP服务',
    parameter: '￥300/月',
    remark: 'VIP服务提供微信、APP消息的及时推送，增加自选数量',
}, {
    key: '2',
    id: '2',
    name: '',
    parameter: '',
    remark: '',
}, {
    key: '3',
    id: '3',
    name: '',
    parameter: '',
    remark: '',
}, {
    key: '4',
    id: '4',
    name: '',
    parameter: '',
    remark: '',
}];
class ParameterSetting extends Component {
    state = {
        visible: false
    }
    showModal = () => {//编辑参数
        this.setState({ visible: true });
        this.props.form.resetFields();
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
        const { confirmLoading, visible } = this.state;
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.showModal}>编辑</a>
                </Menu.Item>
            </Menu>
        );
        const columns = [{
            title: '序号',
            dataIndex: 'id'
        }, {
            title: '参数名称',
            dataIndex: 'name',
        }, {
            title: '参数',
            dataIndex: 'parameter',
        }, {
            title: '备注',
            dataIndex: 'remark',
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: text => (
                <Dropdown overlay={menu}>
                    <a> <Icon type="menu-fold" style={{ fontSize: 15 }} /></a>
                </Dropdown>
            )
        }];
        return (
            <div className="parameterSetting">
                <div className="tableList">
                    <Table pagination={false} columns={columns} dataSource={data} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共 400 条记录 第 1 / 80 页</span>
                    <span className="Pagination text-right">
                        <Pagination total={50} showSizeChanger showQuickJumper hideOnSinglePage />
                    </span>
                </div>
                <Modal title="【参数名称】编辑参数"
                    visible={visible}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 12 }}
                            label="参数："
                            hasFeedback
                        >
                            {getFieldDecorator('content', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                            label="备注："
                        >
                            {getFieldDecorator('details', {
                            })(
                                <TextArea rows={4} placeholder="支持富文本" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(ParameterSetting);