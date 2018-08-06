import React, { Component } from 'react';
import { LocaleProvider, Button, Input, Dropdown, Menu, Icon, Cascader, Table, Form, Pagination, Modal, DatePicker, Divider, Row, Col,Select,message } from 'antd';
import './personalUser.css';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ServerHandle from '../../../utils/ApiHandle';
import $ from 'jquery';
import moment from 'moment';
import 'moment/locale/zh-cn';

const options = [{
    value: 'yes',
    label: '是'
}, {
    value: 'no',
    label: '否'
}];

class PersonalUser extends Component {
    constructor(props){
        super(props);
        this.dataList=this.dataList.bind(this);
        this.handleEdit=this.handleEdit.bind(this);
        this.handlereset=this.handlereset.bind(this);
        this.handleVip=this.handleVip.bind(this);
        this.numChange=this.numChange.bind(this);
        this.sizeChange=this.sizeChange.bind(this);
        this.handleQuery=this.handleQuery.bind(this);
        this.VIP=this.VIP.bind(this);
        this.state={
            editVisible: false,
            detailVisible: false,
            resetVisible: false,
            VipVisible: false,
            confirmLoading: false,
            count:0,
            dataList:[],
            size:20,
            num:1,
            customerId:0,//客户id
            managerId:0,
            value: '',
            managerList:[],
            vipEndtime:'',//vip到期
            telphone:'',//登陆手机
        }
    }
    componentDidMount(){
        this.dataList();
    }
    dataList(){
        let clientMsg=$("#customer").val();
        let managerMsg=$("#manage").val();
        let VIP=$(".personalVip .ant-cascader-picker-label ").text();
        ServerHandle.GET({
            url:'/web/client/list',
            data:{
                pageSize:this.state.size,
                pageNum:this.state.num,
                clientMsg:clientMsg,
                managerMsg:managerMsg,
                isVIP:VIP==='是'?'1':(VIP==="否"?'2':'')
                }
        }).then(result=>{
            if(result.success){
                console.log(result)
                this.setState({count:result.count,dataList:result.data})
            }
        });  
    }
    handleQuery(){
        this.dataList();
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    handleCancel = () => {
        this.setState({
            editVisible: false,
            detailVisible: false,
            VipVisible: false,
            resetVisible: false,
        });
    }
    edit(text){//编辑
        this.setState({ editVisible: true,customerId:text.id },()=>{
            ServerHandle.GET({
                url: '/web/manager/listAll',
                data: {}
            }).then(result => {
                if (result.success) {
                    console.log(result)
                    this.setState({ managerList: result.data })
                }
                else {
                    message.error(result.message);
                }
            });
            ServerHandle.GET({
                url:'/web/client/detail',
                data:{clientId:text.id}
            }).then(result=>{
                if(result.success){
                    console.log(result)
                    this.setState({managerId:result.data.managerId},()=>{
                        this.props.form.setFieldsValue({
                            userName:result.data.userName,
                            telphone:result.data.telphone,
                            name:result.data.realName,
                            asset:result.data.accout,
                            man:result.data.managerName 
                        })
                    });
                }
            })
        });
    }
    detail (text){//详情
        this.setState({ detailVisible: true,customerId:text.id },()=>{
            ServerHandle.GET({
                url:'/web/client/detail',
                data:{clientId:text.id}
            }).then(result=>{
                if(result.success){
                    this.props.form.setFieldsValue({
                        userName:result.data.userName ||'无',
                        telphone:result.data.telphone ||'无',
                        name:result.data.realName ||'无',
                        asset:result.data.accout ||'无',
                        manager:result.data.managerName ||'无', 
                    })
                }
            })
        });
    }
    reset (text) {//重置密码
        this.setState({ resetVisible: true,telphone:text.telphone,customerId:text.id });
    }
    VIP (text){//VIP设置
        console.log(text);
        this.setState({ VipVisible: true, customerId:text.id,vipEndtime:text.vipEndTime,telphone:text.telphone},()=>{
            console.log(this.state.vipEndtime)
        });
    }
    numChange(page, pageSize) {
        this.setState({
            num: page,
            size: pageSize,
        }, () => { this.dataList()})
    }
    sizeChange(current, size) {
        this.setState({
            num: current,
            size: size,
        }, () => {this.dataList()})
    }
    handleEdit(){
        let realName=$("#name").val();
        let asset=$("#asset").val();
        this.props.form.validateFields((err, values) => {
            ServerHandle.POST({
                url:'/web/client/edit',
                data:{
                    id:this.state.customerId,
                    managerId:this.state.managerId,
                    realName:realName,
                    assets:asset,
                }
            }).then(result=>{
                if(result.success){
                    this.setState({
                        confirmLoading:true,
                    },()=>{
                        setTimeout(()=>{
                            this.setState({
                                confirmLoading:false,
                                editVisible:false,
                            });
                            message.success("编辑成功")
                            this.dataList();
                        },2000)
                    })                   
                }else{message.error("编辑失败")}
            })     
        });
    }
    handlereset(){
        ServerHandle.GET({
            url:'/web/client/reset',
            data:{clientId:this.state.customerId}
        }).then(result=>{
            if(result.success){
                this.setState({confirmLoading:true},()=>{
                    setTimeout(()=>{
                        this.setState({confirmLoading:false,resetVisible:false});
                        message.success("密码重置成功");
                        this.dataList();
                    },2000)
                });
            }else{
                message.error("重置失败，请重试");
            }
        })
    }
    handleVip(){
        let endTime=$('#sf input').val();
        ServerHandle.POST({
            url:'/web/client/setVip',
            data:{
                clientId:this.state.customerId,
                endTime:endTime,
            }
        }).then(result=>{
            if(result.success){
                this.setState({confirmLoading:true},()=>{
                    setTimeout(() => {
                        this.setState({
                            confirmLoading:false,
                            VipVisible:false,
                        });
                        message.success("设置成功");
                        this.dataList();
                    }, 2000);
                })
            }else{
                message.error("设置失败")
            }
        });
    }
    render() {
        const columns = [{
                title: '序号',
                key: 'number',
                render:(text,item,key)=>{
                    return key+1
                }
            }, {
                title: '登录手机',
                key: 'telphone',
                render:text=>{
                    return text.telphone
                }
            }, {
                title: '用户名',
                key: 'username ',
                render:text=>{
                    return text.username || '-'
                }
            }, {
                title: '真实姓名',
                key: 'clientName ',
                render:text=>{
                    return text.clientName || '-'
                }
            }, {
                title: 'VIP',
                key: 'vipType ',
                render:text=>{
                    return text.vipType || '无'
                }
            }, {
                title: '注册时间',
                key: 'createTime ',
                render:text=>{
                    return text.createTime 
                }
            }, {
                title: '客户经理',
                key: 'manager',
                render:text=>{
                    return `${text.idCode}:${text.mangerName} ` 
                }
            },{
                title: '操作',
                key: 'operation',
                render: text => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item onClick={()=>{this.edit(text)}}>编辑
                            </Menu.Item>
                            <Menu.Item onClick={()=>{this.detail(text)}}>详情
                            </Menu.Item>
                            <Menu.Item onClick={()=>{this.reset(text)}}>重置密码
                            </Menu.Item>
                            <Menu.Item onClick={()=>{this.VIP(text)}}>VIP设置
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
        const { confirmLoading,editVisible,detailVisible,resetVisible,VipVisible,num,size,count,dataList,managerList,telphone } = this.state;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const children = [];
        const Option = Select.Option;
        managerList.forEach((item, index) => {
            children.push(<Option key={index} value={item.id.toString()}>{item.realName}</Option>);
            return false;
        })
        return (
            <div className="personalUser">
                <Form
                    ref="form"
                    className="flex-column"
                    >
                    <div className="formdiv ">
                        <div className=" al-center flex flex-row ju-center ">
                            <span className=" text-right title-width">客户经理：</span>
                            <span className="input-width" >
                                {getFieldDecorator(`manage`, {})(
                                    <Input placeholder="请输入客户经理ID、真实姓名" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex flex-row  ju-center">
                            <span className="text-right title-width">客户：</span>
                            <span className="input-width" >
                                {getFieldDecorator(`customer`, {})(
                                    <Input placeholder="请输入手机号、用户名、真实姓名" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex flex-row  ju-center">
                            <span className="text-right title-width">VIP：</span>
                            <span className="input-width personalVip">
                                {getFieldDecorator(`VIP`, {})(
                                    <Cascader options={options} placeholder="请选择" />
                                )}
                            </span>
                        </div>
                        <div className="relatedStare-form-Button">
                            <Button type="primary" htmlType="submit" onClick={this.handleQuery}>查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </div>
                    </div>
                </Form>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <div className="tableList">
                    <Table rowKey="id" pagination={false} columns={columns} dataSource={dataList} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共 {count}条记录 第 {num} / {Math.ceil(count / size)}页</span>
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
                                 onShowSizeChange={this.sizeChange}
                            />
                        </LocaleProvider>
                    </span>
                </div>
                <Modal title="编辑个人用户"
                    visible={editVisible}
                    onOk={this.handleEdit}
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
                        >
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="用户名："
                                >
                                  {getFieldDecorator('userName', {})(
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
                                        <Input placeholder="请输入" type="number" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                            <Form.Item
                                {...formItemLayout}
                                label="客户经理："
                                >
                                 {getFieldDecorator('man', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                    <Select
                                        //未找到客户经理，客户经理为空
                                        onBlur={() => {
                                            if (!this.state.managerId) {
                                                this.setState({
                                                    value: ""
                                                })
                                            }
                                        }}
                                        allowClear={true}
                                        onChange={(e) => {
                                            console.log(e)
                                            let find = false;
                                            this.state.managerList.forEach((item, key) => {
                                                //如果找到对应的客户经理ID
                                                console.log(item,key)
                                                if (e === item.id.toString()) {
                                                    find = true;
                                                    this.setState({
                                                        value: item.realName,
                                                        manaegerId: e
                                                    },()=>{
                                                        this.props.form.setFieldsValue({
                                                            man:this.state.value
                                                        })
                                                    })
                                                }
                                            })
                                            !find && this.setState({
                                                value: e,
                                                manaegerId: null,
                                            },()=>{
                                                this.props.form.setFieldsValue({
                                                    man:""
                                                })
                                            })
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
                    </Form>
                </Modal>
                <Modal title="个人用户详情"
                    visible={detailVisible}
                    onCancel={this.handleCancel}
                    cancelText="关闭"
                    width="740px"
                    destroyOnClose="true"
                    className="dd"
                    >
                    <Form
                        ref="form"
                        className="flex-column"
                    >
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="用户名："
                                >
                                 {getFieldDecorator(`userName`, {})(
                                     <Input disabled  />
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="登录手机："
                                >
                                     {getFieldDecorator(`telphone`, {})(
                                     <Input disabled  />
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="姓名："
                                >
                                     {getFieldDecorator(`name`, {})(
                                     <Input disabled  />
                                )}
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="资产："
                                >
                                      {getFieldDecorator(`asset`, {})(
                                     <Input disabled  />
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
                                     {getFieldDecorator(`manager`, {})(
                                     <Input disabled  />
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal title={'对【'+telphone+'】重置密码'}
                    visible={resetVisible}
                    onOk={this.handlereset}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    >
                    <p>确认重置密码为手机号后6位？</p>
                </Modal>
                <Modal title={'【'+telphone+'】设置VIP期限'}
                    visible={VipVisible}
                    onOk={this.handleVip}
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
                            {...formItemLayout}
                            label="VIP到期日："
                        >
                            {getFieldDecorator('divide', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                                initialValue:moment(this.state.vipEndtime,'YYYY-MM-DD'),
                            })(
                                <LocaleProvider locale={zhCN}>
                                    <DatePicker  placeholder="请输入" id="sf"/>
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