import React, { Component } from 'react';
import {LocaleProvider, Icon, Button, Table, Pagination, Form, Input, Cascader, Menu, Dropdown, Modal, Tooltip, Divider } from 'antd';
import { Link } from 'react-router-dom';
import zhCN from 'antd/lib/locale-provider/zh_CN';
//员工管理
const option = [{
    value: '已冻结',
    label: '已冻结'
}, {
    value: '正常',
    label: '正常'
}];
const data = [{
    key: '1',
    id: '3001',
    name: '管理员1',
    tel: '18513516200',
    divide: '18.00%',
    role: '机构管理',
    state: '已冻结',
}, {
    key: '2',
    id: '3002',
    name: '管理员2',
    tel: '18513516201',
    divide: '18.00%',
    role: '普通管理员',
    state: '正常',
}, {
    key: '3',
    id: '3003',
    name: '管理员3',
    tel: '18513516202',
    divide: '18.00%',
    role: '财务管理',
    state: '正常',
}, {
    key: '4',
    id: '3004',
    name: '管理员4',
    tel: '18513516203',
    divide: '18.00%',
    role: '财务管理',
    state: '正常',
}, {
    key: '5',
    id: '3005',
    name: '管理员5',
    tel: '18513516204',
    divide: '18.00%',
    role: '普通管理员',
    state: '正常',
}];
//分配角色role
const rolecolumns = [{
    title: '序号',
    dataIndex: 'id',
}, {
    title: '角色名称',
    dataIndex: 'name',
}, {
    title: '角色描述',
    dataIndex: 'describe',
}, {
    title: '状态',
    dataIndex: 'state',
}]
const role = [{
    key: '1',
    id: '1',
    name: '角色1',
    describe: '描述1',
    state: '已停用'
}, {
    key: '2',
    id: '2',
    name: '角色2',
    describe: '描述2',
    state: '已启用'
}, {
    key: '3',
    id: '3',
    name: '角色3',
    describe: '描述3',
    state: '已停用'
}, {
    key: '4',
    id: '4',
    name: '角色4',
    describe: '描述4',
    state: '已停用'
}]
//安全设置
const securitycolumns = [{
    title: '序号',
    dataIndex: 'id',
}, {
    title: '所属页面',
    dataIndex: 'belong',
}, {
    title: '安全说明',
    dataIndex: 'explain',
}]
const security = [{
    key: '1',
    id: '1',
    belong: '用户管理-个人用户',
    explain: '查看客户手机号',
}, {
    key: '2',
    id: '2',
    belong: '用户管理-机构用户',
    explain: '查看所有客户经理',
}, {
    key: '3',
    id: '3',
    belong: '数据统计-用户数据',
    explain: '查看所有用户数据',
}]
class EmployeeManage extends Component {
    state = {
        endOpen: false,
        visible1: false,
        visible2: false,
        visible3: false,
        visible4: false,
        visible5: false,
        visible6: false,
        visible7: false,
    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    showModal1 = () => {//添加员工
        this.setState({ visible1: true });
        this.props.form.resetFields();
    }
    showModal2 = () => {//冻结/解冻
        this.setState({ visible2: true });
    }
    showModal3 = () => {//VIP分成
        this.setState({ visible3: true });
    }
    showModal4 = () => {//编辑
        this.setState({ visible4: true });
    }
    showModal5 = () => {//重置密码
        this.setState({ visible5: true });
    }
    showModal6 = () => {//分配角色
        this.setState({ visible6: true });
    }
    showModal7 = () => {//安全锁设置
        this.setState({ visible7: true });
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
                visible4: false,
                visible5: false,
                visible6: false,
                visible7: false,
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
            visible3: false,
            visible4: false,
            visible5: false,
            visible6: false,
            visible7: false,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading, } = this.state;
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.showModal2}>冻结/解冻</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal3}>VIP分成</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal4}>编辑</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal5}>重置密码</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal6}>分配角色</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal7}>安全设置</a>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/index/employeeManage/accountFlow">账户流水</Link>
                </Menu.Item>
            </Menu>
        );
        const columns = [{
            title: '工号',
            dataIndex: 'id'
        }, {
            title: '姓名',
            dataIndex: 'name',
        }, {
            title: '联系电话',
            dataIndex: 'tel',
        }, {
            title: 'AQ分成',
            dataIndex: 'divide',
        }, {
            title: '角色',
            dataIndex: 'role',
        }, {
            title: '账号状态',
            dataIndex: 'state',
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: text => (
                <Dropdown overlay={menu}>
                    <Button style={{ marginLeft: 8 }}>
                        操作 <Icon type="down" />
                    </Button>
                </Dropdown>
            )
        }];
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        //rowSelection分配角色对话框表格选择器
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        return (
            <div className="employeeManage">
                <div className="employeeManage-query">
                    <Button type="primary" icon="plus" onClick={this.showModal1} className="primary-btn">添加员工</Button>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                </div>
                <Form
                    ref="form"
                    className="employeeManage-form form"
                    onSubmit={this.handleSearch}
                >
                    <div className="employeeManage-form-input input al-center ">
                        <span className="text-right title-width">员工：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`field-${1}`, {})(
                                <Input placeholder="姓名、联系电话、工号" />
                            )}
                        </span>
                    </div>
                    <div className="employeeManage-form-Cascader cascader al-center">
                        <span className="text-right title-width">状态：</span>
                        <span className="input-width">
                            {getFieldDecorator(`field-${2}`, {})(
                                <Cascader options={option} placeholder="请选择" />
                            )}
                        </span>
                    </div>
                    <div className="employeeManage-form-Button">
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
                <Modal title="添加员工"
                    visible={this.state.visible1}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    destroyOnClose="true"
                >
                    <Form
                        ref="form"
                        className="flex-column"
                        onSubmit={this.handleOk}
                    >
                        <Form.Item
                            {...formItemLayout}
                            label="工号："
                        >
                            {getFieldDecorator('number', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="姓名："
                        >
                            {getFieldDecorator('name', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="联系电话："
                        >
                            {getFieldDecorator('tel', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="冻结/解冻【员工姓名】"
                    visible={this.state.visible2}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>冻结后，此员工不可再次登陆（正常状态）</p>
                    <p>解冻后，员工可正常登陆系统（冻结状态）</p>
                </Modal>
                <Modal title="【姓名】设置AQ分成比例"
                    visible={this.state.visible3}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    destroyOnClose="true"
                >
                    <Form
                        ref="form"
                        className="flex-column"
                        onSubmit={this.handleOk}
                    >
                        <Form.Item
                            {...formItemLayout}
                            label="分成比例："
                        >
                            <Tooltip title="AQ平台获取到的利润比例" placement="topLeft">
                                {getFieldDecorator('divide', {
                                    rules: [
                                        { required: true, message: '请输入' },
                                    ],
                                })(
                                    <Input placeholder="0.1800" />
                                )}
                            </Tooltip>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="编辑【员工姓名】"
                    visible={this.state.visible4}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    destroyOnClose="true"
                >
                    <Form
                        ref="form"
                        className="flex-column"
                        onSubmit={this.handleOk}
                    >
                        <Form.Item
                            {...formItemLayout}
                            label="工号："
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="姓名："
                        >
                            {getFieldDecorator('name', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="联系电话："
                        >
                            {getFieldDecorator('tel', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="对【员工姓名】重置密码"
                    visible={this.state.visible5}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认重置密码为aq123456</p>
                </Modal>
                <Modal title="对【员工姓名】分配角色"
                    visible={this.state.visible6}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    width="970px"
                    destroyOnClose="true"
                >
                    <Table rowSelection={rowSelection} columns={rolecolumns} dataSource={role} bordered />
                </Modal>
                <Modal title="对【员工姓名】安全设置"
                    visible={this.state.visible7}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    width="640px"
                    destroyOnClose="true"
                >
                    <Table rowSelection={rowSelection} columns={securitycolumns} dataSource={security} bordered />
                </Modal>
            </div>
        );
    }
}
export default Form.create()(EmployeeManage);


