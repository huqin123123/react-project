import React, { Component } from 'react';
import { LocaleProvider, Button, Input, Dropdown, Menu, Icon, Cascader, Table, Form, Pagination, Modal, DatePicker, Divider, Row, Col } from 'antd';
import './personalUser.css';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const options = [{
    value: 'yes',
    label: '是'
}, {
    value: 'no',
    label: '否'
}];
const data = [{
    key: '1',
    id: '1',
    phone: '18213516200',
    name: 'login01',
    real: '王小明01',
    vip: '2018-12-30',
    time: '2018-04-05 10:15:25',
    manager: '2008000101:张三',
}, {
    key: '2',
    id: '2',
    phone: '18213516201',
    name: 'login02',
    real: '王小明02',
    vip: '否',
    time: '2018-04-05 10:15:25',
    manager: '2008000101:张三',

}, {
    key: '3',
    id: '3',
    phone: '18213516202',
    name: 'login03',
    real: '王小明03',
    vip: '否',
    time: '2018-04-05 10:15:25',
    manager: '2008000101:张三',

}];
class PersonalUser extends Component {
    state = {
        visible1: false,
        visible2: false,
        visible3: false,
        visible4: false,
        confirmLoading: false,
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
                confirmLoading: false,
            });
        }, 2000);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    }
    handleCancel = () => {
        this.setState({
            visible1: false,
            visible2: false,
            visible3: false,
            visible4: false,

        });
    }
    showModal1 = () => {//编辑
        this.setState({ visible1: true });
    }
    showModal2 = () => {//详情
        this.setState({ visible2: true });
    }
    showModal3 = () => {//重置密码
        this.setState({ visible3: true });
    }
    showModal4 = () => {//VIP设置
        this.setState({ visible4: true });
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.showModal1}>编辑</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal2}>详情</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal3}>重置密码</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal4}>VIP设置</a>
                </Menu.Item>
            </Menu>
        );
        const columns = [{
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '登录手机',
            dataIndex: 'phone',
            key: 'phone',
        }, {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '真实姓名',
            dataIndex: 'real',
            key: 'real',
        }, {
            title: 'VIP',
            dataIndex: 'vip',
            key: 'vip',
        }, {
            title: '注册时间',
            dataIndex: 'time',
            key: 'time',
        }, {
            title: '客户经理',
            dataIndex: 'manager',
            key: 'manager',
        },
        {
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
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <div className="personalUser">
                <Form
                    ref="form"
                    className="flex-column"
                    onSubmit={this.handleSearch}
                >
                    <div className="formdiv ">
                        <div className=" al-center flex flex-row ju-center ">
                            <span className=" text-right title-width">客户经理：</span>
                            <span className="input-width" >
                                {getFieldDecorator(`field-${1}`, {})(
                                    <Input placeholder="请输入手机号" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex flex-row  ju-center">
                            <span className="text-right title-width">客户：</span>
                            <span className="input-width" >
                                {getFieldDecorator(`field-${2}`, {})(
                                    <Input placeholder="请输入手机号" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex flex-row  ju-center">
                            <span className="text-right title-width">VIP：</span>
                            <span className="input-width">
                                {getFieldDecorator(`field-${3}`, {})(
                                    <Cascader options={options} placeholder="请选择" />
                                )}
                            </span>
                        </div>
                        <div className="relatedStare-form-Button">
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
                <Modal title="编辑个人用户"
                    visible={this.state.visible1}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
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
                                    label="用户名："
                                >
                                    <Input disabled placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="登录手机："
                                >
                                    <Input disabled placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="姓名："
                                >
                                    {getFieldDecorator('name', {
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
                                    {getFieldDecorator('asset', {
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
                                    label="客户经理"
                                >
                                    {getFieldDecorator('manager', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <Input placeholder="请输入" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal title="个人用户详情"
                    visible={this.state.visible2}
                    onCancel={this.handleCancel}
                    cancelText="关闭"
                    width="740px"
                    destroyOnClose="true"
                    className="dd"
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
                                    label="用户名："
                                >
                                    <Input disabled placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="登录手机："
                                >
                                    <Input disabled placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="姓名："
                                >
                                    <Input disabled placeholder="请输入" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="资产："
                                >
                                    <Input disabled placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="客户经理"
                                >
                                    <Input disabled placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal title="对【登陆手机】重置密码"
                    visible={this.state.visible3}
                    onOk={this.handleOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认重置密码为手机号后6位？</p>
                </Modal>
                <Modal title="【登陆手机】设置VIP期限"
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
                            label="VIP到期日："
                        >
                            {getFieldDecorator('divide', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <LocaleProvider locale={zhCN}>
                                    <DatePicker  placeholder="请输入" />
                                </LocaleProvider>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(PersonalUser);