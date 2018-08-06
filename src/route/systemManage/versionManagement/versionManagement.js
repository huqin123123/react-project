import React, { Component } from 'react';
import {LocaleProvider, Button, Divider, Input, Modal, Form, Cascader, Icon, Table, Pagination, Menu, Dropdown,message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import $ from 'jquery';
import ServerHandle from '../../../utils/ApiHandle';
//版本管理
const { TextArea } = Input;
const options = [{
    value: 'Android',
    label: 'Android'
}, {
    value: 'IOS',
    label: 'IOS'
}, {
    value: 'PC',
    label: 'PC'
}];

class VersionManagement extends Component {
    constructor(props){
        super(props);
        this.dataList=this.dataList.bind(this);
        this.addEdition=this.addEdition.bind(this);
        this.cancelRelease=this.cancelRelease.bind(this);
        this.release=this.release.bind(this);
        this.handleAddEdition=this.handleAddEdition.bind(this);
        this.handleCancelRelease=this.handleCancelRelease.bind(this);
        this.handlereset=this.handlereset.bind(this);
        this.numChange=this.numChange.bind(this);
        this.sizeChange=this.sizeChange.bind(this);
        this.state={
            addVisible: false,
            cancelVisible: false,
            releaseVisible: false,
            confirmLoading: false,
            count:0,
            dataList:[],
            num:1,
            size:20,
            type:'',//终端类型
            id:0,//版本id
            versionCode :''//版本号
        }
    }
    componentDidMount(){
        this.dataList();
    }
    dataList(){
        ServerHandle.GET({
            url:'/web/system/version/list',
            data:{pageNum:this.state.num,pageSize:this.state.size}
        }).then(result=>{
            if(result.success){
                console.log(result)
                this.setState({count:result.count,dataList:result.data})
            }
        })
    }
    addEdition(){
        this.setState({
            addVisible: true,
        });
    }
    cancelRelease(text){
        this.setState({
            cancelVisible: true,
            type:text.type,
            id:text.id,
            versionCode:text.versionCode
        });
    }
    release(text){
        this.setState({
            releaseVisible: true,
            type:text.type,
            id:text.id,
            versionCode:text.versionCode
        });
    }
    handleAddEdition(){
        this.props.form.validateFields((err, values) => {
            let type=$(".addEdition .ant-cascader-picker").text();
            let versionName=$("#versioName").val();
            let versionNum=$("#versionNum").val();
            let dress=$("#dress").val();
            let remark=$("#remark").val();
            ServerHandle.POST({
                url:'/web/system/version/add',
                data:{
                    type:type==="Android"?'1':(type==="IOS"?'2':(type==="PC"?'3':'')),
                    versionName:versionName,
                    versionCode:versionNum,
                    linkAddress:dress,
                    remark:remark
                }
            }).then(result=>{
                if(result.success){
                    this.setState({
                        confirmLoading:true
                    },()=>{
                        setTimeout(()=>{
                            this.setState({
                                confirmLoading:false,
                                addVisible:false,
                            },()=>{
                                message.success("添加版本成功");
                                this.dataList();
                            });
                        },2000)
                    });
                }else{message.error("添加版本失败")}
            })
        });
    }
    handleCancelRelease(){
        ServerHandle.POST({
            url:'/web/system/version/unPublish',
            data:{
                type:this.state.type,
                id:this.state.id
            }
        }).then(result=>{
            if(result.success){
                this.setState({
                    confirmLoading:true
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            confirmLoading:false,
                            cancelVisible:false,
                        },()=>{
                            message.success("取消发布成功");
                            this.dataList();
                        });
                    },2000)
                });
            }else{message.error("取消发布失败")}
        })
    }
    handlereset(){
        ServerHandle.POST({
            url:'/web/system/version/publish',
            data:{
                type:this.state.type,
                id:this.state.id
            }
        }).then(result=>{
            if(result.success){
                this.setState({
                    confirmLoading:true
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            confirmLoading:false,
                            releaseVisible:false,
                        },()=>{
                            message.success("发布成功");
                            this.dataList();
                        });
                    },2000)
                });
            }else{message.error("发布失败")}
        })

    }
    sizeChange(current,size){
        this.setState({
            num:current,
            size:size
        },()=>{this.dataList()})
    }
    numChange(page,pageSize){
        this.setState({
            num:page,
            size:pageSize
        },()=>{this.dataList()})
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
                confirmLoading: false,
            });
        }, 2000);
        e.preventDefault();
      
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    handleCancel = () => {
        this.setState({
            addVisible: false,
            cancelVisible: false,
            releaseVisible: false,
        });
    }
    render() {
        const { confirmLoading,addVisible,cancelVisible,releaseVisible,size,num,count,dataList,versionCode,type } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
        const columns = [{
                title: '序号',
                key: 'number',
                render:(text,item,key)=>{
                    return key+1
                }
            }, {
                title: '版本号',
                key: 'versionCode',
                render:text=>{
                    return text.versionCode
                }
            }, {
                title: '版本名',
                key: 'versionName ',
                render:text=>{
                    return text.versionName
                }
            }, {
                title: '终端',
                key: 'type',
                render:text=>{
                    return text.type===1?'Android':(text.type===2?'IOS':(text.type===3?'PC':'-')) 
                }
            }, {
                title: '发布时间',
                key: 'pushDate',
                render:text=>{
                    return text.pushDate || '-'
                }
            }, {
                title: '状态',
                key: 'status ',
                render:text=>{
                    return text.status===0?'未发布':(text.status===1?'已发布':(text.status===2?'已取消':'-'))  
                }
            }, {
                title: '操作',
                key: 'operation',
                render: text => (
                    <Dropdown disabled={text.latest!==1} overlay={ 
                        <Menu>
                            
                            <Menu.Item disabled={text.status===(0 && 2)} onClick={()=>{this.cancelRelease(text)}}>取消发布
                            </Menu.Item>
                            <Menu.Item disabled={text.status===1} onClick={()=>{this.release(text)}}>发布
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
            <div className="VersionManagement">
                <div className="VersionManagement-query">
                    <Button type="primary" icon="plus" onClick={this.addEdition} className="primary-btn">添加版本</Button>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                </div>
                <div className="tableList">
                    <Table rowKey="id" pagination={false} columns={columns} dataSource={dataList} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共 {count}条记录 第 {num}/{Math.ceil(count/size)}页</span>
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
                <Modal title="添加版本"
                    visible={addVisible}
                    onOk={this.handleAddEdition}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    destroyOnClose={true}
                    >
                    <Form
                        ref="form"
                        className="flex-column addEdition"
                    >
                        <Form.Item
                            {...formItemLayout}
                            label="终端："
                        >
                            <Cascader options={options} placeholder="请选择" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="版本名："
                        >
                            {getFieldDecorator('versioName', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="版本号："
                        >
                            {getFieldDecorator('versionNum', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />,
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="链接地址："
                        >
                            {getFieldDecorator('dress', {
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
                            label="备注："
                        >
                        {getFieldDecorator('remark', {})(
                            <TextArea rows={4} placeholder="请输入" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={'【'+(type===3?'PC':(type===2?'IOS':(type===1?'Android':'-')))+':'+versionCode+'】取消发布'}
                    visible={cancelVisible}
                    onOk={this.handleCancelRelease}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    >
                    <p>确认取消发布版本？</p>
                </Modal>
                <Modal title={'【'+(type===3?'PC':(type===2?'IOS':(type===1?'Android':'-')))+':'+versionCode+'】发布版本'}
                    visible={releaseVisible}
                    onOk={this.handlereset}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    >
                    <p>确认发布此版本？</p>
                </Modal>
            </div >
        );
    }
}
export default Form.create()(VersionManagement);
