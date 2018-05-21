import React, { Component } from 'react';
import './customerList.css';
import { Icon, Button, Table, Pagination, Form, Input, Cascader, DatePicker, Menu, Dropdown,Modal } from 'antd';
const option1 = [{
    value: '所有用户',
    label: '所有用户'
}, {
    value: '所有机构',
    label: '所有机构'
}];
const option2 = [{
    value: '已上架',
    label: '已上架'
}, {
    value: '已下架',
    label: '已下架'
}, {
    value: '未上架',
    label: '未上架'
}];
const data = [{
    key: '1',
    id: '1',
    time: '2018-04-05 10:15:25',
    name: '股海老刘',
    founder: '王**(189**1635)',
    date: '2018-04-05',
    price: '￥10.00/月',
    share: '所有用户',
    state: '已上架',
}, {
    key: '2',
    id: '2',
    time: '2018-04-05 10:15:25',
    name: '许阳',
    founder: '王**(189**1635)',
    date: '2018-04-05',
    price: '￥10.00/月',
    share: '所有机构',
    state: '已下架',
}, {
    key: '3',
    id: '3',
    time: '2018-04-05 10:15:25',
    name: 'lovely_tr',
    founder: '王**(189**1635)',
    date: '2018-04-05',
    price: '￥10.00/月',
    share: '所有机构',
    state: '已下架',
}];

class CustomerList extends Component {
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
        visible1: false,
        visible2: false,
        confirmLoading: false
    };
    /**
     * disabledStartDate开始日期
     * disabledEndDate结束日期
     */
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
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
      this.setState({
          startValue:null,
          endValue:null,
      });
    }
    handleOk = (e) => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible1: false,
                visible2:false,
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
                visible2:false,
        });
    }
    showModal1 = () => {//上下架
        this.setState({ visible1: true });
    }
    showModal2 = () => {//分享
        this.setState({visible2: true });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { startValue, endValue, endOpen } = this.state;
        const menu = (
            <Menu>
                <Menu.Item>
                    <a  onClick={this.showModal1}>上/下架</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.showModal2}>分享</a>
                </Menu.Item>
            </Menu>
        );
        const columns = [{
            title: '序号',
            dataIndex: 'id'
        }, {
            title: '创建时间',
            dataIndex: 'time',
        }, {
            title: '投顾名称',
            dataIndex: 'name',
        }, {
            title: '创建人',
            dataIndex: 'founder',
        }, {
            title: '开始日期',
            dataIndex: 'date',
        }, {
            title: '分享价格',
            dataIndex: 'price',
        }, {
            title: '投顾分享',
            dataIndex: 'share',
        }, {
            title: '状态',
            dataIndex: 'state',
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: text => (
                <Dropdown overlay={menu}>
                    <a> <Icon type="menu-fold" style={{fontSize:15}} /></a>
                </Dropdown>
            )
        }];
        const { confirmLoading } = this.state;
        return (
            <div className="customerList">
                <Form
                    ref="form"
                    className="flex-column"
                    onSubmit={this.handleSearch}
                >
                    <div className=" formdiv ">
                        <div className=" al-center  list-width">
                            <span className="text-right title-width">创建人：</span>
                            <span className="input-width">
                                {getFieldDecorator(`field-${1}`, {})(
                                    <Input placeholder="请输入策略名称或ID" />
                                )}
                            </span>
                        </div>
                        <div className="al-center input-data flex">
                            <span className="text-right title-width">创建日期：</span>
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
                        <div className=" al-center list-width">
                            <span className="text-right title-width">投顾分享：</span>
                            <span className="input-width">
                                {getFieldDecorator(`field-${2}`, {})(
                                    <Cascader options={option1} placeholder="请选择" />
                                )}

                            </span>
                        </div>

                        <div className="al-center list-width">
                            <span className="text-right title-width">状态：</span>
                            <span className="input-width">
                                {getFieldDecorator(`field-${3}`, {})(
                                    <Cascader options={option2} placeholder="请选择" />
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
                <Modal title="【策略名称】上下架操作"
                    visible={this.state.visible1}
                    onOk={this.handleOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认上架/下架策略？</p>
                </Modal>
                <Modal title="【策略名称】上下架操作"
                    visible={this.state.visible2}
                    onOk={this.handleOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认分享此投顾给所有用户？</p>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(CustomerList);


