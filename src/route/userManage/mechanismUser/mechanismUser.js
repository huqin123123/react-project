import React, { Component } from 'react';
import {LocaleProvider, Button, Divider, Input, Cascader, Form, Icon, Table, Pagination, Menu, Dropdown, Modal, Row, Col, Tooltip } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const { TextArea } = Input;
//员工管理
const options = [{
    value: '在职',
    label: '在职'
}, {
    value: '离职',
    label: '离职'
}];
const option = [{
    value: '是',
    label: '是'
}, {
    value: '否',
    label: '否'
}]
const data = [{
    key: '1',
    id:'2008000101',
    name: 'login01',
    realname: '王小明01',
    tel:'18213516200',
    staff: '001：管理员',
    mechanismdivide: '80.00%',
    maintaindivide: '20.00%',
    time: '2018-04-05 10:15:25'
}, {
    key: '2',
    id:'2008000102',
    name: 'login02',
    realname: '王小明02',
    tel:'18213516201',
    staff: '001：管理员',
    mechanismdivide: '80.00%',
    maintaindivide: '20.00%',
    time: '2018-04-05 10:15:25'
},{
    key: '3',
    id:'2008000103',
    name: 'login03',
    realname: '王小明03',
    tel:'18213516202',
    staff: '001：管理员',
    mechanismdivide: '80.00%',
    maintaindivide: '20.00%',
    time: '2018-04-05 10:15:25'
},{
    key: '4',
    id:'2008000104',
    name: 'login04',
    realname: '王小明04',
    tel:'18213516203',
    staff: '001：管理员',
    mechanismdivide: '80.00%',
    maintaindivide: '20.00%',
    time: '2018-04-05 10:15:25'
}];
class MechanismUser extends Component {
    state = {
        visible1: false, visible2: false, visible3: false, visible4: false, visible5: false,
        confirmLoading: false
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    showModal1 = () => {//添加客户经理
        this.setState({ visible1: true });
    }
    showModal2 = () => {//VIP分成
        this.setState({ visible2: true });
    }
    showModal3 = () => {//编辑
        this.setState({ visible3: true });
    }
    showModal4 = () => {//重置密码
        this.setState({ visible4: true });
    }
    showModal5 = () => {//详情
        this.setState({ visible5: true });
    }
    handleOk = (e) => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible1: false, visible2: false, visible3: false, visible4: false, visible5: false,
                confirmLoading: false,
            });
        }, 2000);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        });
    }
    handleCancel = () => {
        this.setState({
            visible1: false, visible2: false, visible3: false, visible4: false, visible5: false,
        });
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.showModal2} >VIP分成</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal3} >编辑</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal4} >重置密码</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal5} >详情</a>
                </Menu.Item>
            </Menu>
        );
        const columns = [{
            title: 'ID号',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '真实姓名',
            dataIndex: 'realname',
            key: 'realname',
        }, {
            title: '手机号',
            dataIndex: 'tel',
            key: 'tel',
        }, {
            title: '维护人员',
            dataIndex: 'staff',
            key: 'staff',
        }, {
            title: '机构用户分成',
            dataIndex: 'mechanismdivide',
            key: 'mechanismdivide',
        }, {
            title: '维护人员分成',
            dataIndex: 'maintaindivide',
            key: 'maintaindivide',
        }, {
            title: '注册时间',
            dataIndex: 'time',
            key: 'time',
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
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading } = this.state;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        return (
            <div className="mechanismUser">
                <div className="mechanismUser-query">
                    <Button type="primary" icon="plus" onClick={this.showModal1} className="primary-btn">添加客户经理</Button>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                </div>
                <Form
                    ref="form"
                    className="mechanismUser-form form"
                    onSubmit={this.handleSearch}
                >
                    <div className="mechanismUser-form-input input al-center ">
                        <span className="text-right title-width4">客户经理：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`field-${1}`, {})(
                                <Input placeholder="姓名、联系电话、ID号" />
                            )}
                        </span>
                    </div>
                    <div className="mechanismUser-form-Cascader cascader al-center">
                        <span className="text-right title-width">员工：</span>
                        <span className="input-width">
                            {getFieldDecorator(`field-${2}`, {})(
                                <Cascader options={options} placeholder="姓名、工号" />
                            )}
                        </span>
                    </div>
                    <div className="mechanismUser-form-Button">
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
                <Modal title="添加客户经理"
                    visible={this.state.visible1}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    width="740px"
                    destroyOnClose={true}
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
                                    label="登录手机："
                                >
                                    {getFieldDecorator('tel', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <Input placeholder="请输入" />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="用户名："
                                >
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <Input placeholder="请输入" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="真实姓名："
                                >
                                    {getFieldDecorator('real-name', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <Input placeholder="请输入" />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="资产："
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="维护人员："
                                >
                                    {getFieldDecorator('maintain', {
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Input placeholder="请选择" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="是否员工"
                                >
                                    {getFieldDecorator('staff', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <Cascader options={option} placeholder="请选择" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="备注"
                                >
                                    <TextArea rows={4} placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal title="【姓名】设置AQ分成比例"
                    visible={this.state.visible2}
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
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
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
                <Modal title="编辑客户经理"
                    visible={this.state.visible3}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    width="740px"
                    okText="保存"
                    destroyOnClose={true}
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
                                    label="ID号："
                                >
                                    <Input placeholder="请输入" disabled/>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="登录手机："
                                >
                                    <Input placeholder="请输入" disabled/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="用户名："
                                >
                                    <Input placeholder="请输入" disabled/>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="真实姓名："
                                >
                                    <Input placeholder="请输入" disabled/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="VIP分成比例："
                                >
                                    <Input placeholder="请输入" disabled/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="维护人员："
                                >
                                    {getFieldDecorator('manager', {
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Cascader options={option} placeholder="请选择" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="资产："
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="是否员工"
                                >
                                    {getFieldDecorator('manager', {
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Cascader options={option} placeholder="请选择" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="备注"
                                >
                                    <TextArea rows={4} placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal title="对【登陆手机】重置密码"
                    visible={this.state.visible4}
                    onOk={this.handleOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                  <p>确认重置密码为手机后6位？</p>
                </Modal>
                <Modal title="机构用户详情"
                    visible={this.state.visible5}
                    onCancel={this.handleCancel}
                    cancelText="关闭"
                    width="740px"
                    className="dd"
                    destroyOnClose={true}
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
                                    label="ID号："
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="登录手机："
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="用户名："
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="真实姓名："
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="VIP分成比例："
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="维护人员："
                                >
                                    <Input placeholder="请选择" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="资产："
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="是否员工"
                                >
                                   <Input placeholder="请选择" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="备注"
                                >
                                    <TextArea rows={4} placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div >
        );
    }
}
export default Form.create()(MechanismUser);
