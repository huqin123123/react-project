import React, { Component } from 'react';
import {LocaleProvider, Dropdown, Menu, Icon, Table, Pagination, Modal, Button, Divider} from 'antd';
import { Link,  } from 'react-router-dom';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const data = [{
    key: '1',
    id: '1',
    block: '首页轮播',
    title: '量化体验',
    state: '冻结',
}, {
    key: '2',
    id: '2',
    block: '首页自选',
    title: '自选说明',
    state: '正常',
}, {
    key: '3',
    id: '3',
    block: '首页智能投顾',
    title: '智能投顾',
    state: '正常',
}, {
    key: '4',
    id: '4',
    block: '首页VIP服务',
    title: 'VIP服务',
    state: '正常',
}, {
    key: '5',
    id: '5',
    block: '用户协议',
    title: '用户协议',
    state: '正常',
}, {
    key: '6',
    id: '6',
    block: '订阅协议',
    title: '订阅协议',
    state: '正常',
}, {
    key: '7',
    id: '7',
    block: '帮助文档',
    title: '帮助文档',
    state: '正常',
}, {
    key: '8',
    id: '8',
    block: '专业详解',
    title: '专业详解',
    state: '正常',
}, {
    key: '9',
    id: '9',
    block: '引导下载APP',
    title: '量化家APP',
    state: '正常',
}];
 export default  class Manage extends Component {
    state = {
        visible: false,
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
        })
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.showModal}>冻结/解冻</a>
                </Menu.Item>
                <Menu.Item>
                        <Link to="/contentManage/editContent">编辑内容</Link>
                </Menu.Item>
            </Menu>
        );
        const columns = [{
            title: '序号',
            dataIndex: 'id'
        }, {
            title: '内容版块',
            dataIndex: 'block',
        }, {
            title: '内容标题',
            dataIndex: 'title',
        }, {
            title: '状态',
            dataIndex: 'state',
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
        const { confirmLoading } = this.state;
        return (
            <div className="contentManage">
                <div className="contentManage-query">
                    <Link to="/contentManage/addContent"><Button type="primary" icon="plus" className="primary-btn" onClick={this.handClick}>添加内容</Button></Link>
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
                <Modal title="【内容标题】冻结/解冻操作"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认冻结/解冻内容？</p>
                </Modal>
            </div>
        );
    }
}
