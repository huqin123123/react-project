import React, { Component } from 'react';
import { LocaleProvider, Button, Divider, Input, Cascader, Form, Icon, Table, Pagination, Menu, Dropdown, Modal, Row, Col, Tooltip, message,Select } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ServerHandle from '../../../utils/ApiHandle';
import $ from 'jquery';
const { TextArea } = Input;
//员工管理

const option = [{
    value: '1',
    label: '是',
}, {
    value: '2',
    label: '否',
}]

class MechanismUser extends Component {
    constructor(props) {
        super(props);
        this.bindData = this.bindData.bind(this);
        this.numChange = this.numChange.bind(this);
        this.onShowSizeChange = this.onShowSizeChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.showModal1 = this.showModal1.bind(this);
        this.showModal2 = this.showModal2.bind(this);
        this.showModal3=this.showModal3.bind(this);
        this.showModal4=this.showModal4.bind(this);
        this.showModal5=this.showModal5.bind(this);
        this.handleEdit=this.handleEdit.bind(this);
        this.handleAdd=this.handleAdd.bind(this);
        this.userList=this.userList.bind(this);
        this.handleEditManager=this.handleEditManager.bind(this);
        this.handleResetPsw=this.handleResetPsw.bind(this);
        this.state = {
            visible1: false,
            visible2: false,
            visible3: false,
            visible4: false,
            visible5: false,
            confirmLoading: false,
            num: 1,
            size: 20,
            //客户经理列表
            managerList: [],
            count: 0,
            //员工列表
            userList:[],
            //员工姓名
            value:'',
            //员工id
            userId:[],
            managerId:0,
            // managerDivideScale:'',
            isEmployee:'',
            userName:'',
            loginTel:'',
        }
    }
    componentDidMount() {
        this.bindData();        
    }
    bindData() {
        let manager = $('#managerMsg').val();
        let employee = $('#employee').val()
        ServerHandle.GET({
            url: '/web/manager/list',
            data: {
                pageNum: this.state.num,
                pageSize: this.state.size,
                managerMsg: manager,
                employeeMsg: employee,
            }
        }).then(result => {
            if (result.success) {
                console.log(result);
                this.setState({
                    managerList: result.data,
                    count: result.count,
                })
            }
        })
    }
    numChange(page, pageSize) {
        this.setState({
            num: page,
            size: pageSize,
        }, () => { this.bindData() })
    }
    onShowSizeChange(current, size) {
        this.setState({
            num: current,
            size: size,
        }, () => { this.bindData() })
    }
    handleSearch() {
        this.bindData()
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    //获取员工列表
    userList(){
        ServerHandle.GET({
            url:'/web/user/admin/listUser',
            data:{}
        }).then(result=>{
            this.setState({userList:result.data},()=>{})
        })
    }
      //添加客户经理 
    showModal1(){
          this.setState({visible1:true},()=>{
              this.userList();
          })
    }
    handleAdd (){
        this.props.form.validateFields((err, values) => {});
        let telphone=$("#tel").val();
        let username=$("#name").val();
        let realname=$("#realName").val();
        let money=$("#money").val();
        let remark =$("#remark").text();
        let isEmployee =$("#mechanismForm .ant-cascader-picker-label").text();
        this.setState({
            confirmLoading: true,
             visible1: true }, () => {
            ServerHandle.POST({
                url: '/web/manager/addManager',
                data: {
                    username: username,
                    telphone: telphone,
                    realNmae: realname,
                    money: money,
                    userId: this.state.userId,
                    remark: remark,
                    isEmployee: isEmployee === "是" ? 1 : 2,
                }
            }).then(result=>{
                if(result.success){
                    setTimeout(() => {
                        this.setState({
                            visible1: false,
                            confirmLoading: false,
                        },()=>{
                            message.success("添加成功");
                            this.bindData();
                        });
                    }, 2000);
                }else{
                 this.setState({confirmLoading:false},()=>{
                    message.error(result.message);
                 })
                }
            })
        });
    }
   //VIP分成
    showModal2 = (text) => {
        this.setState({ 
            visible2: true ,
            managerId:text.id,
            userName:text.realName,
        },()=>{
            this.props.form.setFieldsValue({divide:text.managerDivideScale});               
        }); 
    }
    handleEdit(){
        this.props.form.validateFields((err, values) => {});
        let divide=$("#divide").val();
        this.setState({managerDivideScale:divide},()=>{
            ServerHandle.POST({
                url:'/web/manager/updateDivide',
                data:{managerId:this.state.managerId,managerDivideScale:divide}
            }).then(result=>{
                if(result.success){
                    this.setState({confirmLoading:true})
                    setTimeout(()=>{
                        this.setState({
                            confirmLoading:false,
                            visible2:false
                        },()=>{message.success("编辑成功");this.bindData()})
                    },2000)
                }else{
                 message.error("编辑失败")   
                }
            })
        });  
    }
    //编辑客户经理
    showModal3(text) {
        this.setState({ 
            visible3: true,
            managerId:text.id,
         },()=>{
            this.userList();
             ServerHandle.GET({
                 url:'/web/manager/detail',
                 data:{managerId:text.id}
             }).then(result=>{
                 if(result.success){
                     this.setState({
                         isEmployee:result.data.isEmployee,
                         userId:result.data.userId
                        },()=>{
                            this.props.form.setFieldsValue({
                                managerId:text.id,
                                telphone:result.data.telphone,
                                username:result.data.username,
                                realName:result.data.realName,
                                managerDivideScale:result.data.managerDivideScale,
                                userId:result.data.employName,
                                account:result.data.money,
                                remarks:result.data.remark,
                                });  
                        })
                 }
             })
         });
    }
    handleEditManager(){
        this.setState({confirmLoading:true});
        this.props.form.validateFields((err, values) => {});   
        let isEmployee =$("#edit .ant-cascader-picker-label").text();
        let money=$("#account").val();
        let remark=$("#remarks").val();
        ServerHandle.POST({
            url:'/web/manager/edit',
            data:{
                id:this.state.managerId,
                employeeId:this.state.userId,
                accout:money,
                remark:remark,
                editIsEmployee:isEmployee ==="是" ? 1:2,
            }
        }).then(result=>{
            if(result.success){
                this.setState({confirmLoading:true},()=>{
                    setTimeout(() => {
                        this.setState({
                            visible3: false,
                            confirmLoading: false,
                        },()=>{
                            message.success("编辑成功");
                            this.bindData();
                        });
                    }, 2000);
                });
            }else{
                message.error("编辑失败")
            }
        })
    }
    //重置密码
    showModal4 (text) {
        this.setState({ visible4: true,managerId:text.id,loginTel:text.telphone});
    }
    handleResetPsw(){
        ServerHandle.POST({
            url:'/web/manager/reset',
            data:{managerId:this.state.managerId}
        }).then(result=>{
            if(result.success){
                this.setState({confirmLoading:true});
                setTimeout(()=>{
                    this.setState({
                        visible4:false,
                        confirmLoading:false,
                    },()=>{message.success("密码重置成功")})
                },2000);
            }else{
                message.error("密码重置失败")
            }
        })
    }
    //客户经理详情
    showModal5(text) {
        this.setState({ visible5: true });
        this.setState({ 
            visible3: true,
            managerId:text.id
         },()=>{
            this.userList();
             ServerHandle.GET({
                 url:'/web/manager/detail',
                 data:{managerId:text.id}
             }).then(result=>{
                 if(result.success){
                     this.props.form.setFieldsValue({
                        manageId:text.id,
                        Tel:result.data.telphone,
                        userName:result.data.username,
                        rename:result.data.realName,
                        Divide:result.data.managerDivideScale,
                        User:result.data.employName || '无',
                        Money:result.data.money,
                        isStaff:result.data.isEmployee === 1?'是':'否',
                        remarkS:result.data.remark || '无',
                        });  
                 }
             })
         });
    }
    handleCancel = () => {
        this.setState({
            visible1: false, visible2: false, visible3: false, visible4: false, visible5: false,
        });
    }
    render() {
        const columns = [{
                title: 'ID号',
                key: 'id',
                render: (text) => {
                    return text.id
                }
            }, {
                title: '用户名',
                key: 'username',
                render: (text) => {
                    return text.username || '-'
                }
            }, {
                title: '真实姓名',
                key: 'realname',
                render: (text) => {
                    return text.realName || '-'
                }
            }, {
                title: '手机号',
                key: 'tel',
                render: (text) => {
                    return text.telphone || '-'
                }
            }, {
                title: '维护人员',
                key: 'staff',
                render: (text) => {
                    return `${text.employeeID} _ ${text.employName}`
                }
            }, {
                title: '机构用户分成',
                key: 'mechanismdivide',
                render: (text) => {
                    return text.managerDivideScale 
                }
            }, {
                title: '维护人员分成',
                key: 'maintaindivide',
                render: (text) => {
                    return text.userDivideScale
                }
            }, {
                title: '注册时间',
                key: 'time',
                render: (text) => {
                    return text.createTime || '-'
                }
            }, {
                title: '操作',
                key: 'operation',
                render: (text) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item onClick={()=>{this.showModal2(text)}}>VIP分成
                            </Menu.Item>
                            <Menu.Item onClick={()=>{this.showModal3(text)}}>编辑
                            </Menu.Item>
                            <Menu.Item onClick={()=>{this.showModal4(text)}} >重置密码
                            </Menu.Item>
                            <Menu.Item onClick={()=>{this.showModal5(text)}} >详情
                            </Menu.Item>
                        </Menu>
                    }>
                        <Button style={{ marginLeft: 8 }}>
                            操作 <Icon type="down" />
                        </Button>
                    </Dropdown>
                )
        }];
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading, count, num, size, managerList,userList,isEmployee,userName,loginTel } = this.state;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const children = [];
        const Option = Select.Option;
        userList.forEach((item, index) => {
            children.push(<Option key={item} value={item.id.toString()}>{item.userName}</Option>);
            return false;
        })
        return (
            <div className="mechanismUser">
                <div className="mechanismUser-query">
                    <Button type="primary" icon="plus" onClick={this.showModal1} className="primary-btn">添加客户经理</Button>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                </div>
                <Form
                    ref="form"
                    className="mechanismUser-form form"
                    >
                    <div className="mechanismUser-form-input input al-center ">
                        <span className="text-right title-width4">客户经理：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`managerMsg`, {})(
                                <Input placeholder="姓名、联系电话、ID号" />
                            )}
                        </span>
                    </div>
                    <div className="mechanismUser-form-Cascader cascader al-center">
                        <span className="text-right title-width">员工：</span>
                        <span className="input-width">
                            {getFieldDecorator(`employeeMsg`, {})(
                                <Input placeholder="姓名、工号" />
                            )}
                        </span>
                    </div>
                    <div className="mechanismUser-form-Button">
                        <Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    </div>
                </Form>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <div className="tableList">
                    <Table rowKey="id" pagination={false} columns={columns} dataSource={managerList} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共 {count} 条记录 第  {num} / {Math.ceil(count / size)} 页</span>
                    <span className="Pagination text-right">
                        <LocaleProvider locale={zhCN}>
                            <Pagination
                                total={count}
                                showSizeChanger={true}
                                showQuickJumper={true}
                                hideOnSinglePage={false}
                                current={num}
                                pageSize={size}
                                onChange={this.numChange}
                                onShowSizeChange={this.onShowSizeChange}
                            />
                        </LocaleProvider>
                    </span>
                </div>
                <Modal title="添加客户经理"
                    visible={this.state.visible1}
                    onOk={this.handleAdd}
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
                        id="mechanismForm"
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
                                        <Input placeholder="请输入" type="number"/>
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
                                    {getFieldDecorator('realName', {
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
                                   {getFieldDecorator('money', {})(
                                        <Input placeholder="请输入" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="维护人员："
                                >
                                    {getFieldDecorator('userId', {
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select
                                        //未找到维护人员
                                            onBlur={() => {
                                                if (!this.state.userId) {
                                                    this.setState({
                                                        value: ""
                                                    })
                                                }
                                            }}
                                            allowClear={true}
                                            onChange={(e) => {
                                                console.log(e)
                                                let find = false;
                                                this.state.userList.forEach((item, key) => {
                                                    //如果找到对应的维护人员ID
                                                    if (e === item.id.toString()) {
                                                        find = true;
                                                        this.setState({
                                                            value: item.userName,
                                                            userId: e
                                                        },()=>{
                                                            this.props.form.setFieldsValue({userId:this.state.value})
                                                            });    
                                                    }
                                                });
                                                !find && this.setState({
                                                    value: e,
                                                    userId: null,
                                                });
                                            }}
                                            mode={'combobox'}
                                            style={{ width: '100%' }}
                                            placeholder="请选择"
                                            showArrow={true}
                                            showSearch={true}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {children}
                                        </Select>
                                     )}  
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="是否员工"
                                >
                                    {getFieldDecorator('isEmployee', {
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Cascader options={option} placeholder="请选择"/>
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
                                   {getFieldDecorator('remark', {})(
                                    <TextArea rows={4} placeholder="请输入"  id="remark"/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal title={'【'+userName+'】设置AQ分成比例'}
                    visible={this.state.visible2}
                    onOk={this.handleEdit}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    destroyOnClose="true"
                    >
                    <Form
                        ref="form"
                        className="flex-column"
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
                                    <Input placeholder="0.1800" type="number"/>
                                )}
                            </Tooltip>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="编辑客户经理"
                    visible={this.state.visible3}
                    onOk={this.handleEditManager}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    width="740px"
                    okText="保存"
                    destroyOnClose={true}
                    >
                    <Form
                        ref="form"
                        className="flex-column"
                        id="edit"
                    >
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="ID号："
                                >
                                 {getFieldDecorator('managerId', {})(
                                    <Input disabled />
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="登录手机："
                                >
                                {getFieldDecorator('telphone', {})(
                                    <Input disabled />
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="用户名："
                                >
                                    {getFieldDecorator('username', {})(
                                    <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="真实姓名："
                                >
                                    {getFieldDecorator('realName', {})(
                                    <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="VIP分成比例："
                                >
                                   {getFieldDecorator('managerDivideScale', {})(
                                    <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="维护人员："
                                >
                                    {getFieldDecorator('userId', {
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select
                                        //未找到维护人员
                                            onBlur={() => {
                                                if (!this.state.userId) {
                                                    this.setState({
                                                        value: ""
                                                    })
                                                }
                                            }}
                                            allowClear={true}
                                            onChange={(e) => {
                                                console.log(e)
                                                let find = false;
                                                this.state.userList.forEach((item, key) => {
                                                    //如果找到对应的维护人员ID
                                                    if (e === item.id.toString()) {
                                                        find = true;
                                                        this.setState({
                                                            value: item.userName,
                                                            userId: e
                                                        },()=>{
                                                            this.props.form.setFieldsValue({userId:this.state.value})
                                                            });    
                                                    }
                                                });
                                                !find && this.setState({
                                                    value: e,
                                                    userId: null,
                                                });
                                            }}
                                            mode={'combobox'}
                                            style={{ width: '100%' }}
                                            placeholder="请选择"
                                            showArrow={true}
                                            showSearch={true}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {children}
                                        </Select>
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
                                 {getFieldDecorator('account', {})(
                                    <Input placeholder="请输入" type="number"/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="是否员工"
                                >
                                    {getFieldDecorator('Employee', {
                                        initialValue:[isEmployee === 2 ? "2":"1"],                                        
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
                                {getFieldDecorator('remarks', {})(
                                    <TextArea rows={4} placeholder="请输入" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal title={'【'+loginTel+'】重置密码'}
                    visible={this.state.visible4}
                    onOk={this.handleResetPsw}
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
                                   {getFieldDecorator('manageId', {})(<Input  disabled />)}
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="登录手机："
                                >
                                   {getFieldDecorator('Tel', {})(<Input  disabled />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="用户名："
                                >
                                    {getFieldDecorator('userName', {})(<Input  disabled />)}
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="真实姓名："
                                >
                                    {getFieldDecorator('rename', {})(<Input  disabled />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="VIP分成比例："
                                >
                                    {getFieldDecorator('Divide', {})(<Input  disabled />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="维护人员："
                                >
                                    {getFieldDecorator('User', {})(<Input  disabled />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="资产："
                                >
                                    {getFieldDecorator('Money', {})(<Input  disabled />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="是否员工"
                                >
                                     {getFieldDecorator('isStaff', {})(<Input  disabled />)}
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
                                 {getFieldDecorator('remarkS', {})(  <TextArea rows={4} disabled/>)}
                                  
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
