import React, { Component } from 'react';
import { Button, Divider, Input, Cascader, Form, Icon, Table, Pagination, Menu, Dropdown, Modal } from 'antd';
import './employeeList.css';
//员工管理
const options = [{
    value: '在职',
    label: '在职'
}, {
    value: '离职',
    label: '离职'
}];
const data = [{
    key: '1',
    num: '3001',
    name: '管理员',
    tel: '18213516200',
    AQ: '18.00%',
    role: '机构管理',
    state: '已冻结'
}, {
    key: '2',
    num: '3002',
    name: '管理员',
    tel: '18213516201',
    AQ: '18.00%',
    role: '普通管理员',
    state: '正常'
}];
class EmployeeList extends Component {
    state = {
        visible: false,
        confirmLoading: false
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
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    showModal= () => {//VIP设置
        this.setState({visible: true });
        this.props.form.resetFields();
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a >冻结/解冻</a>
                </Menu.Item>
                <Menu.Item>
                <a onClick={this.showModal} >VIP分成</a>
                </Menu.Item>
                <Menu.Item>
                <a >编辑</a>
                </Menu.Item>
                <Menu.Item>
                    <a >重置密码</a>
                </Menu.Item>
                <Menu.Item>
                    <a >分配角色</a>
                </Menu.Item>
                <Menu.Item>
                    <a>安全设置</a>
                </Menu.Item>
                <Menu.Item>
                    <a >账户流水</a>
                </Menu.Item>
            </Menu>
        );
        const columns = [{
            title: '工号',
            dataIndex: 'num',
            key: 'num',
        }, {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '联系电话',
            dataIndex: 'tel',
            key: 'tel',
        }, {
            title: 'AQ分成',
            dataIndex: 'AQ',
            key: 'AQ',
        }, {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
        }, {
            title: '账号状态',
            dataIndex: 'state',
            key: 'state',
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => (
                <Dropdown overlay={menu}>
                    <a >
                        <Icon type="menu-fold" style={{fontSize:15}} />
                    </a>
                </Dropdown>)
        }];
        const { getFieldDecorator } = this.props.form;
        const { visible, confirmLoading } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        return (
            <div className="employeeList">
                <div className="employeeList-query">
                    <Button type="primary" icon="plus">添加用户</Button>
                    <Divider />
                </div>
                <Form
                    ref="form"
                    className="form"
                    onSubmit={this.handleSearch}
                >
                    <div className="al-center ">
                        <span className="text-right title-width">员工：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`field-${2}`, {})(
                                <Input placeholder="姓名、联系电话、工号" />
                            )}
                        </span>
                    </div>
                    <div className="al-center">
                        <span className="text-right title-width">状态：</span>
                        <span className="input-width">
                            {getFieldDecorator(`field-${3}`, {})(
                                <Cascader options={options} placeholder="请选择" />
                            )}
                        </span>
                    </div>
                    <div className="">
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
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
                    <Modal title="【姓名】设置AQ分成比例"
                       visible={visible}
                       onOk={this.handleOk}
                       okText="保存"
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                       cancelText="取消"
                    >
                        <Form
                            ref="form"
                            className="flex-column"
                            onSubmit={this.handleOk}
                        >
                            <Form.Item
                                {...formItemLayout}
                                label="分成比例"
                                hasFeedback
                            >
                                {getFieldDecorator('Proportion', {
                                    rules: [
                                        { required: true, message: '请输入' },
                                    ],
                                })(
                                    <Input placeholder="AQ平台获取到的利润比例" />
                                )}
                            </Form.Item>
                        </Form>
                    </Modal>
            </div >
        );
    }
}
export default Form.create()(EmployeeList);
