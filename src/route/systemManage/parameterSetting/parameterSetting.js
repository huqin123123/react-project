import React, { Component } from 'react';
import { LocaleProvider, Dropdown, Menu, Icon, Table, Form, Pagination, Modal, Input, Button,message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import $ from 'jquery';
import ServerHandle from '../../../utils/ApiHandle';
//参数设置
const { TextArea } = Input;

class ParameterSetting extends Component {
    constructor(props){
        super(props);
        this.dataList=this.dataList.bind(this);
        this.numChange=this.numChange.bind(this);
        this.sizeChange=this.sizeChange.bind(this);
        this.handleEdit=this.handleEdit.bind(this);
        this.editParameter=this.editParameter.bind(this);
        this.state={
            visible:false,
            num:1,
            size:20,
            count:0,
            dataList:[],
            parameter:[],//参数设置
        }
    }
    componentDidMount(){
        this.dataList();
    }
    dataList(){
        ServerHandle.GET({
            url:'/web/system/parameterSetting/list',
            data:{pageNum:this.state.num,pageSize:this.state.size}
        }).then(result=>{
            if(result.success){
                this.setState({dataList:result.data,count:result.count});
            }
        });
    }
    numChange(page,pageSize){
        this.setState({
            num:page,
            size:pageSize
        },()=>{this.dataList()})
    }
    sizeChange(current,size){
        this.setState({
            num:current,
            size:size
        },()=>{this.dataList()})
    }
    editParameter (parameter){//编辑参数
        this.setState({ visible: true,parameter:parameter },()=>{
            this.props.form.setFieldsValue({
                content:this.state.parameter.value ,
                remark:this.state.parameter.remark
            });
        });
    }
    handleEdit () {
        this.props.form.validateFields((err, values) => {
            this.setState({
                confirmLoading: true,
            },()=>{
                let content=$("#content").val();
                let remark =$("#remark").val();
                ServerHandle.POST({
                    url:'/web/system/parameterSetting',
                    data:{
                        value:content,
                        remark:remark,
                        id:this.state.parameter.id
                    }
                }).then(result=>{
                    if(result.success){
                        setTimeout(() => {
                            this.setState({
                                visible: false,
                                confirmLoading: false,
                            });
                            message.success("编辑参数成功")
                            this.dataList();
                        }, 2000);
                    }else{
                        message.error("编辑参数失败")
                    }
                })
            })
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading, visible,size,num,count,dataList } = this.state;
        const columns = [{
                title: '序号',
                key: 'number',
                render:(text,item,key)=>{
                    return key+1
                }
            }, {
                title: '参数名称',
                key: 'name',
                render:text=>{
                    return text.name 
                }
            }, {
                title: '参数',
                key: 'value',
                render:text=>{
                    return text.value 
                }
            }, {
                title: '备注',
                key: 'remark ',
                render:text=>{
                    return text.remark  
                }
            }, {
                title: '操作',
                key: 'operation',
                render: text => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item>
                                <a onClick={()=>{this.editParameter(text)}}>编辑</a>
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
            <div className="parameterSetting">
                <div className="tableList">
                    <Table rowKey="id" pagination={false} columns={columns} dataSource={dataList} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共{count}条记录 第 {num} / {Math.ceil(count/size)} 页</span>
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
                <Modal title="【参数名称】编辑参数"
                    visible={visible}
                    onOk={this.handleEdit}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    destroyOnClose={true}
                >
                    <Form >
                        <Form.Item
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                            label="参数："
                        >
                            {getFieldDecorator('content', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                            label="备注："
                        >
                         {getFieldDecorator('remark', {
                            })(
                            <TextArea rows={4} placeholder="多行文本" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(ParameterSetting);