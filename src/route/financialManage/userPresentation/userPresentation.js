import React, { Component } from 'react';
import {LocaleProvider, Button, Table, Pagination, Form, Input, Cascader, Divider, Dropdown, Icon, Menu, Modal, Row, Col, Radio } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import $ from 'jquery';
import ServerHandle from '../../../utils/ApiHandle';
const { TextArea } = Input;
const options = [{
    value: '已通过',
    label: '已通过'
}, {
    value: '未通过',
    label: '未通过'
}, {
    value: '待审核',
    label: '待审核'
}];


class UserPresentation extends Component {
    constructor (props){
        super(props);
        this.handleExamine=this.handleExamine.bind(this);
        this.dataList=this.dataList.bind(this);
        this.sizeChange=this.sizeChange.bind(this);
        this.numChange=this.numChange.bind(this);
        this.examine=this.examine.bind(this);
        this.details=this.details.bind(this);
        this.handleQuery=this.handleQuery.bind(this);
        this.radioChange=this.radioChange.bind(this);
        this.state={
            value:3,
            examineVisible: false,
            detailsVisible: false,
            confirmLoading: false,
            size:20,
            num:1,
            dataList:[],
            count:0,
            status:'',//1=审核中；2=已通过；3=未通过
            reflectId:0,//提现申请记录表id
            realName:'',
        }
    }
    componentDidMount(){
        this.dataList();
    }
    dataList(){
        let manager=$("#manager").val();
        let status=$(".presentation .ant-cascader-picker-label").text();
        ServerHandle.GET({
            url:'/web/drawcash/list',
            data:{
                pageNum:this.state.num,
                pageSize:this.state.size,
                managerMsg:manager,
                status:status==="已通过"?'2':(status==="未通过"?'3':(status==="审核中"?'1':'')),
            }
        }).then(result=>{
            if(result){
                this.setState({dataList:result.data,count:result.count})
            }
        });
    }
    sizeChange(page,pageSize){
        this.setState({num:page,size:pageSize},()=>{this.dataList()});
    }
    numChange(current,size){
        this.setState({num:current,size:size},()=>{this.dataList()});
    }
    handleQuery(){
        this.dataList();
    }
    examine(text){//审核
        this.setState({ examineVisible: true,reflectId:text.id,realName:text.realName },()=>{
            ServerHandle.POST({
                url:'/web/drawcash/authDetail',
                data:{drawcashId:this.state.reflectId}
            }).then(result=>{
                if(result.success){
                    console.log(result)
                    this.props.form.setFieldsValue({
                        time:result.data.createTime,
                        money:result.data.price,
                        realName:result.data.realName,
                        telphone:result.data.telphone,
                        bank:result.data.bankName,
                        bankNo:result.data.bankNo,
                        dress:result.data.openingAddress,
                    });
                }
            });
        })
    }
    details(text){//详情
        this.setState({ detailsVisible: true,reflectId:text.id,realName:text.realName },()=>{
            ServerHandle.POST({
                url:'/web/drawcash/authDetail',
                data:{drawcashId:this.state.reflectId}
            }).then(result=>{
                if(result.success){
                    console.log(result)
                    this.props.form.setFieldsValue({
                        createTime:result.data.createTime,
                        price:result.data.price,
                        realName:result.data.realName,
                        telphone:result.data.telphone,
                        bankName:result.data.bankName,
                        bankNo:result.data.bankNo,
                        openingAddress:result.data.openingAddress,
                    });
                }
            });
        });
    }
    handleExamine(){
        let desc=$("#reason").text();
        ServerHandle.POST({
            url:'/web/drawcash/auth',
            data:{
                id:this.state.reflectId,
                authDesc:desc,
                status:this.state.value.toString(),
            }
        }).then(result=>{
            console.log(this.state.value.toString(),typeof(this.state.value.toString()))
            if(result.success){
                console.log(this.state.value.toString())
                console.log(result)
            }
        })
    }
    radioChange(e){
        this.setState({
            value: e.target.value,
        },()=>{console.log(this.state.value)});
    }
    handleCancel = () => {
        this.setState({
            examineVisible: false,
            detailsVisible: false,
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {examineVisible,detailsVisible,size,num,dataList,count,realName}=this.state;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const columns = [{
                title: '序号',
                key: 'number',
                render:(text,item,key)=>{
                    return key+1
                }
            }, {
                title: '提现时间',
                key: 'createTime ',
                render:text=>{
                    return text.createTime 
                }
            }, {
                title: '真实姓名',
                key: 'realName ',
                render:text=>{
                    return text.realName 
                }
            }, {
                title: '手机号',
                key: 'telphone ',
                render:text=>{
                    return text.telphone 
                }
            }, {
                title: '提现金额',
                key: 'price',
                render:text=>{
                    return text.price
                }
            }, {
                title: '审核状态',
                key: 'status',
                render:text=>{
                    return text.status===2?'已通过':(text.status===1?'审核中':(text.status===3?"未通过":'-'))
                }
            }, {
                title: '操作',
                key: 'options',
                render: text => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item onClick={()=>{this.examine(text)}}>审核
                            </Menu.Item>
                            <Menu.Item onClick={()=>{this.details(text)}}>详情
                            </Menu.Item>
                    </Menu>
                    }>
                        <Button style={{ marginLeft: 8 }}>
                            操作 <Icon type="down" />
                        </Button>
                    </Dropdown>
                )
        }];
        return (
            <div className="userPresentation">
                <Form
                    ref="form"
                    className="form"
                >
                    <div className="al-center ">
                        <span className="text-right title-width4">客户经理：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`manager`, {})(
                                <Input placeholder="请输入策略名称或ID" />
                            )}
                        </span>
                    </div>
                    <div className="al-center presentation">
                        <span className="text-right title-width">状态：</span>
                        <span className="input-width">
                            {getFieldDecorator(`status`, {})(
                                <Cascader options={options} placeholder="请选择" />
                            )}
                        </span>
                    </div>
                    <div className="strategy-form-Button">
                        <Button type="primary" htmlType="submit" onClick={this.handleQuery}>查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    </div>
                </Form>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <div className="tableList">
                    <Table rowKey="id" pagination={false} columns={columns} dataSource={dataList} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共  {count}条记录 第 {num} / {Math.ceil(count/size)} 页</span>
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
                <Modal title={'[' + realName +']提现审核'}
                    visible={examineVisible}
                    onCancel={this.handleCancel}
                    onOk={this.handleExamine}
                    okText="确认"
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
                                    label="提现时间："
                                >
                                  {getFieldDecorator(`time`, {})(
                                    <Input disabled />
                                  )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="体现金额："
                                >
                                   {getFieldDecorator(`money`, {})(
                                    <Input disabled />
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
                                     {getFieldDecorator(`realName`, {})(
                                    <Input disabled />
                                  )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="手机号："
                                >
                                    {getFieldDecorator(`telphone`, {})(
                                    <Input disabled />
                                  )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="提现银行："
                                >
                                {getFieldDecorator(`bank`, {})(
                                    <Input disabled />
                                  )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="银行卡号："
                                >
                                {getFieldDecorator(`bankNo`, {})(
                                    <Input disabled />
                                  )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="开户地址："
                                >
                                 {getFieldDecorator(`dress`, {})(
                                   <TextArea rows={2} disabled />
                                  )}
                                    
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="原因："
                                >
                                 {getFieldDecorator(`reason`, {})(
                                    <TextArea rows={2} />
                                 )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="审核："
                                >
                                    <Radio.Group style={{ paddingTop: 8 }} onChange={this.radioChange} value={this.state.value}>
                                        <Radio value={2}>通过</Radio>
                                        <Radio value={3}>不通过</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal title={'[' + realName +']提现审核详情'}
                    visible={detailsVisible}
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
                                    label="体现时间："
                                >
                                     {getFieldDecorator(`createTime`, {})(
                                    <Input disabled />
                                  )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="提现金额："
                                >
                                     {getFieldDecorator(`price`, {})(
                                    <Input disabled />
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
                                     {getFieldDecorator(`realName`, {})(
                                    <Input disabled />
                                  )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="手机号："
                                >
                                    {getFieldDecorator(`telphone`, {})(
                                    <Input disabled />
                                  )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="体现银行："
                                >
                                    {getFieldDecorator(`bankName`, {})(
                                    <Input disabled />
                                  )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="银行卡号："
                                >
                                     {getFieldDecorator(`bankNo`, {})(
                                    <Input disabled />
                                  )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="开户地址："
                                >
                                 {getFieldDecorator(`openingAddress`, {})(
                                    <TextArea rows={2} disabled />
                                  )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(UserPresentation);


