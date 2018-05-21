import React, { Component } from 'react';
import { Button, Input,Dropdown,Menu ,Icon,Cascader,Table,Form,Pagination,Modal,DatePicker } from 'antd';
import './personalUser.css';
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
    time:'2018-04-05 10:15:25',
    manager: '2008000101:张三',
}, {
    key: '2',
    id: '2',
    phone: '18213516201',
    name: 'login02',
    real: '王小明02',
    vip: '否',
    time:'2018-04-05 10:15:25',
    manager: '2008000101:张三',

},{
    key: '3',
    id: '3',
    phone: '18213516202',
    name: 'login03',
    real: '王小明03',
    vip: '否',
    time:'2018-04-05 10:15:25',
    manager: '2008000101:张三',

}];
 class PersonalUser extends Component {
    state = {
        visible: false,
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
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    }
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }
    showModal= () => {//VIP设置
        this.setState({visible: true });
        this.props.form.resetFields();
    }
    render() {
        const menu = (
            <Menu>
              <Menu.Item>
                <a>编辑</a>
              </Menu.Item>
              <Menu.Item>
                <a>详情</a>
              </Menu.Item>
              <Menu.Item>
                <a>重置密码</a>
              </Menu.Item>
              <Menu.Item>
                <a onClick={this.showModal}>VIP设置</a>
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
    },{
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
            <a><Icon type="menu-fold" style={{fontSize:15}} /></a>
          </Dropdown>
        )
    }];
    const { getFieldDecorator } = this.props.form;    
    const { visible, confirmLoading } = this.state; 
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };  
    function onChange(date, dateString) {
        console.log(date, dateString);
      }
        return (
            <div className="personalUser">
             <Form
                ref="form"
                className="form"
                onSubmit={this.handleSearch}
                >
                <div className="al-center flex ">
                    <span className="text-right title-width">员工：</span>
                    <span className="input-width" >
                            {getFieldDecorator(`field-${2}`, {})(
                            <Input placeholder="姓名、联系电话、工号"/>
                            )}
                        </span>   
                </div>
                <div className=" al-center">
                    <span className="text-right title-width">状态：</span>
                    <span className="input-width">
                    {getFieldDecorator(`field-${3}`, {})(
                                <Cascader options={options} placeholder="请选择" />
                            )}
                    </span>
                </div>                    
                <div className="addUser-form-Button">
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
                <Modal title="【登录手机】设置VIP"
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
                                label="VIP到期日"
                            >
                                {getFieldDecorator('Proportion', {
                                    rules: [
                                        { required: true, message: '请输入' },
                                    ],
                                })(
                                    <DatePicker  onChange={onChange} style={{width:314}} placeholder="请选择日期"/>
                                )}
                            </Form.Item>
                        </Form>
                    </Modal>
            </div>
        );
    }
}
export default Form.create()(PersonalUser);