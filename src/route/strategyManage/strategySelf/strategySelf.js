import React, { Component } from 'react';
import { Button, Divider, Input, Cascader, Form, Icon, Table, Pagination, Menu, Dropdown, Checkbox, Modal, Row, Col, Radio } from 'antd';
import './strategySelf.css';
const options = [{
    value: '已上架',
    label: '已上架'
}, {
    value: '已下架',
    label: '已下架'
}, {
    value: '未上架',
    label: '未上架'
}, {
    value: '已弃用',
    label: '已弃用'
}];

const data = [{
    key: '1',
    id: '1',
    name: '夕阳红',
    author: '股海老刘',
    price: '￥10.00/月',
    capacity: '10万',
    share: '所有用户',
    experience: '15日',
    date: '2018-04-05',
    state: '已上架',//蓝色

}, {
    key: '2',
    id: '2',
    name: '海选换仓',
    author: '许阳',
    price: '￥10.00/月',
    capacity: '20万',
    share: '所有机构',
    experience: '无',
    date: '2018-04-05',
    state: '已下架',
}, {
    key: '3',
    id: '3',
    name: 'JC001',
    author: 'lovely_tr',
    price: '￥10.00/月',
    capacity: '10万',
    share: '-',
    experience: '无',
    date: '2018-04-05',
    state: '已弃用',
}];

class StrategySelf extends Component {
    /**
     * 对话框
     */
    state = {
        modal1visible: false,
        modal2visible: false,
        modal4visible: false,
        modal5visible: false,
        confirmLoading: false,
        value: 3,
        checked:false,
    }
    showModal1 = () => {//添加策略
        this.setState({ modal1visible: true ,checked:false});
    }
    showModal2 = () => {//上/下架
        this.setState({ modal2visible: true });
    }
    showModal4 = () => {//编辑
        this.setState({ modal4visible: true });
    }
    showModal5 = () => {//分享策略
        this.setState({ modal5visible: true });
    }
    handleOk = (e) => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                modal1visible: false,
                modal2visible: false,
                modal4visible: false,
                modal5visible: false,
                confirmLoading: false,
            });
        }, 2000);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        });
    }
    handleCancel = () => {
        this.setState({
            modal1visible: false,
            modal2visible: false,
            modal4visible: false,
            modal5visible: false,
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
    radioChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }
    handleCheck = (e) =>{
        this.setState({
            checked:e.target.checked
        })
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.showModal2}>上/下架</a>
                </Menu.Item>
                <Menu.Item>
                    <a>弃用</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal4} >编辑</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal5}>分享</a>
                </Menu.Item>
            </Menu>
        );
        const columns = [{
            title: '策略ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '策略名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '策略作者',
            dataIndex: 'author',
            key: 'author',
        }, {
            title: '分享价格',
            dataIndex: 'price',
            key: 'price',
        }, {
            title: '资金容量',
            dataIndex: 'capacity',
            key: 'capacity',
        }, {
            title: '策略分享',
            dataIndex: 'share',
            key: 'share',
        }, {
            title: '策略体验',
            dataIndex: 'experience',
            key: 'experience',
        }, {
            title: '添加日期',
            dataIndex: 'date',
            key: 'date',
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
                    <a ><Icon type="menu-fold" style={{ fontSize: 15 }} /></a>
                </Dropdown>
            )
        }];
        const columnsM = [{
            title: '序号',
            dataIndex: 'number',
        }, {
            title: '真实姓名',
            dataIndex: 'name',
        }, {
            title: '登录手机',
            dataIndex: 'iPhone',
        }, {
            title: '分享状态',
            dataIndex: 'state',
        }];
        const dataM = [{
            key: '1',
            number: '1',
            name: '王小明01',
            iPhone: '185213516200',
            state: '已分享'
        }, {
            key: '2',
            number: '2',
            name: '王小明01',
            iPhone: '185213516200',
            state: '-'
        }, {
            key: '3',
            number: '3',
            name: '王小明01',
            iPhone: '185213516200',
            state: '-'
        }, {
            key: '4',
            number: '4',
            name: '王小明01',
            iPhone: '185213516200',
            state: '-'
        }];
        const { confirmLoading } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 12 },
        }
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
            },
            // getCheckboxProps: record => ({
            //     disabled: record.name === '王小明01', // Column configuration not to be checked
            //     name: record.name,
            //   }),
        }
        return (
            <div className="strategySelf">
                <div className="strategy-query">
                    <Button type="primary" icon="plus" onClick={this.showModal1}>添加策略</Button>
                    <Divider />
                </div>
                <Form
                    ref="form"
                    className="strategy-form form"
                    onSubmit={this.handleSearch}
                >
                    <div className="strategy-form-input input al-center ">
                        <span className="text-right title-width">策略：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`field-${2}`, {})(
                                <Input placeholder="请输入策略名称或ID" />
                            )}
                        </span>
                    </div>
                    <div className="strategy-form-Cascader cascader al-center">
                        <span className="text-right title-width">状态：</span>
                        <span className="input-width">
                            {getFieldDecorator(`field-${3}`, {})(
                                <Cascader options={options} placeholder="请选择" />
                            )}
                        </span>
                    </div>
                    <div className="strategy-form-Button">
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
                {/* 对话框 */}
                <Modal title="添加策略"
                    visible={this.state.modal1visible}
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
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            label="免费体验"
                        >
                            <Row gutter={15}>
                                <Col span={15}>
                                    {getFieldDecorator('experience', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <Input placeholder="请输入" disabled={this.state.checked?false:true} />
                                    )}
                                </Col>
                                <Col span={8}>
                                    <Checkbox ref="check" checked={this.state.checked} onChange={this.handleCheck}>参与体验</Checkbox>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="策略名称"
                            hasFeedback
                        >
                            {getFieldDecorator('Policy name', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="策略作者"
                            hasFeedback
                        >
                            {getFieldDecorator('Strategic author', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入"  />
                            )}
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            label="分析价格"
                        >
                            <Row gutter={15}>
                                <Col span={15}>
                                    {getFieldDecorator('price', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <Input placeholder="请输入" />
                                    )}
                                </Col>
                                <Col span={4}>
                                    <span>/月</span>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="资金容量"
                            hasFeedback
                        >
                            {getFieldDecorator('Biaoti', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="【策略名称】上下架操作"
                    visible={this.state.modal2visible}
                    onOk={this.handleOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认上架/下架策略？</p>
                </Modal>
                <Modal title="编辑策略【策略名称】"
                    visible={this.state.modal4visible}
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
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            label="免费体验"
                        >
                            <Row gutter={15}>
                                <Col span={15}>
                                    {getFieldDecorator('experience', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <Input placeholder="请输入" disabled={this.state.checked?false:true} />
                                    )}
                                </Col>
                                <Col span={8}>
                                    <Checkbox ref="check" checked={this.state.checked} onChange={this.handleCheck}>参与体验</Checkbox>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="策略名称"
                        >
                            {getFieldDecorator('Policy name', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="策略作者"
                        >
                            {getFieldDecorator('Strategic author', {
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
                            label="分析价格"
                        >
                            <Row gutter={15}>
                                <Col span={15}>
                                    {getFieldDecorator('price', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <Input placeholder="请输入" />
                                    )}
                                </Col>
                                <Col span={4}>
                                    <span>/月</span>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="资金容量"
                        >
                            {getFieldDecorator('Biaoti', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="分享策略【策略名称】"
                    visible={this.state.modal5visible}
                    onOk={this.handleOk}
                    okText="确认分享"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    width={900}
                    destroyOnClose={true}
                >
                    <Radio.Group onChange={this.radioChange} value={this.state.value}>
                        <Radio value={1}>所有用户</Radio>
                        <Radio value={2}>所有机构</Radio>
                        <Radio value={3}>选择指定机构</Radio>
                    </Radio.Group>
                    <Form
                        ref="form"
                        className="modal-form form"
                        onSubmit={this.handleSearch}
                    >
                        <div className=" input al-center ">
                            <span className="text-right title-width">机构用户：</span>
                            <span className="input-width" >
                                {getFieldDecorator(`field-${2}`, {})(
                                    <Input placeholder="请输入" />
                                )}
                            </span>
                        </div>
                        <div className="modal-btn">
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </div>
                    </Form>
                    <Table pagination={false} rowSelection={rowSelection} columns={columnsM} dataSource={dataM} />
                    <div className="Statistics">
                        <span className="total">共 400 条记录 第 1 / 80 页</span>
                        <span className="Pagination text-right">
                            <Pagination total={50} showSizeChanger showQuickJumper hideOnSinglePage />
                        </span>
                    </div>
                </Modal>
            </div >
        );
    }
}
export default Form.create()(StrategySelf);