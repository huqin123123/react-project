import React, { Component } from 'react';
import {LocaleProvider, Button, Divider, Input, Modal, Form, Icon, Table, Pagination, Menu, Dropdown, Tree,message } from 'antd';
import './roleManage.css';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import $ from 'jquery';
import ServerHandle from '../../../utils/ApiHandle';
// import Emit from '../../../utils/Emit';
const { TextArea } = Input;
class RoleManage extends Component {
    constructor(props){
        super(props);
        this.showModal2=this.showModal2.bind(this);
        this.showModal3=this.showModal3.bind(this);
        this.onShowSizeChange=this.onShowSizeChange.bind(this);
        this.numChange=this.numChange.bind(this);
        this.handleEdit=this.handleEdit.bind(this);
        this.handleAdd=this.handleAdd.bind(this);
        this.handleQuery=this.handleQuery.bind(this);
        this.handleOk=this.handleOk.bind(this);
        this.state = {
            visible1: false,
            visible2: false,
            visible3: false,
            confirmLoading: false,
            //分页页码，条数
            num:1,
            size:20,
            count:0,
            roleList:[],
            roleId:0,
            //权限列表
            jurisdictionList:[],
            //选中权限
            checkedMsg:[],
              // 自动展开父节点
              autoExpandParent: true,
              expandedKeys: ['0-1', '0-1-4'],
              checkedKeys: ['0-1-4'],
        }
    }
    componentDidMount(){
        this.bindData()
    }
    bindData(){
        let rolename=$("#name").val();
        ServerHandle.GET({
            url:'/web/permission/role/list',
            data:{
                pageNum:this.state.num,
                pageSize:this.state.size,
                roleName:rolename,
            }
        }).then(result=>{
            if(result.success){
                this.setState({roleList:result.data,count:result.count})
            }
        })
    }
    //分页
    numChange(page, pageSize) {
        this.setState({
            num: page,
            size: pageSize,
        }, () => {
            this.bindData();
        })
    }
    onShowSizeChange(current, size) {
        this.setState({
            num: current,
            size: size,
        }, () => {
            this.bindData();
        })
    }
    //添加角色
    showModal1 = () => {
        this.setState({
            visible1: true,
        });
    }
    //编辑角色
    showModal2(text) {
        console.log(text)
        this.setState({
            visible2: true,
            roleId:text.id,
            roleName:text.roleName,
            description:text.description,
        },()=>{
            this.props.form.setFieldsValue({
                roleName:text.roleName,
                describe:text.description
            })
        });
    }
    //分配权限
    showModal3(text) {
        this.setState({
            visible3: true,
            roleId:text.id,
            roleName:text.roleName,
        },()=>{
            ServerHandle.GET({
                url:'/web/permission/role/getRoleMenu',
                data:{roleId:text.id}
            }).then(result=>{
                if(result.success){
                    console.log(result)
                    this.setState({jurisdictionList:result.data})
                }
            })
        });
    }
    handleAdd () {
        let name=$('#rolename').val();
        let description=$('#descripte').val();
        this.setState({
            confirmLoading: true,
        });
        ServerHandle.POST({
            url:'/web/permission/role/add',
            data:{
                roleName:name,
                description:description,
            }
        }).then(result=>{
            if(result.success){
                this.props.form.validateFields((err, values) => {  });
                setTimeout(() => {
                    this.setState({
                        visible1: false,
                        confirmLoading: false,
                    },()=>{
                        message.success("添加角色成功");
                        this.bindData();
                    });
                }, 2000);
            }else(
                setTimeout(() => {
                this.setState({
                    visible1: false,
                    confirmLoading: false,
                },()=>{message.error("添加失败");});
            }, 2000))
        })
    }
    handleEdit(e){
        let name=$('#roleName').val();
        let describe=$("#describe").val();
        this.setState({
            confirmLoading: true,
        });
        ServerHandle.POST({
            url:'/web/permission/role/update',
            data:{
                id:this.state.roleId,
                roleName:name,
                description:describe,
            }
        }).then(result=>{
            if(result.success){
                this.props.form.validateFields((err, values) => {});                
                setTimeout(() => {
                    this.setState({
                        visible2: false,
                        confirmLoading: false,
                    },()=>{
                        message.success("修改成功");
                        this.bindData();
                    });
                }, 2000);
            }else(
                setTimeout(() => {
                this.setState({
                    visible2: false,
                    confirmLoading: false,
                },()=>{message.error("修改失败")});
            }, 2000))
        })
    }
    handleQuery(){
        //查询
        this.bindData();
    } 
    handleOk(){
        ServerHandle.POST({
            url:'/web/permission/role/updateRoleMenu',
            data:{
                "menuTreeVOS": 
                [
                  {
                    btnId: 0,
                    checked: false,
                    id: 0,
                    name: "string",
                    open: true,
                    parentId: 0
                  }
                ],
                roleId: this.state.roleId,
              }
        })
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    handleCancel = () => {
        this.setState({
            visible1: false,
            visible2: false,
            visible3: false,
        });
    }
    //树形控件
    onCheck = (checkedKeys,info,item) => {
        console.log(checkedKeys,info)
        this.setState({ checkedKeys:checkedKeys,checked:info},()=>{
        });
    }
    //	展开/收起节点时触发
    onExpand = (expandedKeys,info) => {
    console.log( expandedKeys,info);
    this.setState({
        expandedKeys,
        autoExpandParent: false,
    })
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.child) {
                return (
                    <Tree.TreeNode title={item.menuName} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.child)}
                    </Tree.TreeNode>
                );
            }
                return <Tree.TreeNode title={item.menuName} key={item.key} dataRef={item}/>;        
        });
    }
    render() {
        const { confirmLoading,roleList,count,num,size,roleName } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        const columns = [{
                title: '序号',
                key: 'id',
                render:(text,item,key)=>{
                    return key+1
                }
            }, {
                title: '角色名称',
                key: 'name',
                render:(text)=>{
                    return (text.roleName || '-') 
                }
            }, {
                title: '角色描述',
                key: 'describe',
                render:(text)=>{
                    return (text.description || '-')
                }
            }, {
                title: '操作',
                key: 'operation',
                render: text => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item onClick={()=>{this.showModal2(text)}}>编辑
                            </Menu.Item>
                            <Menu.Item onClick={()=>{this.showModal3(text)}}>分配权限
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
            <div className="RoleManage">
                <div className="RoleManage-query">
                    <Button type="primary" icon="plus" onClick={this.showModal1} className="primary-btn">添加角色</Button>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                </div>
                <Form
                    ref="form"
                    className="RoleManage-form formdiv"
                    onSubmit={this.handleSearch}
                    >
                    <div className="RoleManage-form-input flex-row al-center ">
                        <span className="text-right title-width4">角色名称：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`name`, {})(
                                <Input placeholder="请输入" />
                            )}
                        </span>
                    </div>
                    <div className="RoleManage-form-Button flex">
                        <Button type="primary" htmlType="submit" onClick={this.handleQuery}>查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    </div>
                </Form>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <div className="tableList">
                    <Table rowKey="id" pagination={false} columns={columns} dataSource={roleList} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共 {count} 条记录 第 {num} / {Math.ceil(count / size)} 页</span>
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
                <Modal title="添加角色"
                    visible={this.state.visible1}
                    onOk={this.handleAdd}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    destroyOnClose={true}
                    >
                    <Form
                        ref="form"
                        className="flex-column"
                    >
                        <Form.Item
                            {...formItemLayout}
                            label="角色名称："
                        >
                            {getFieldDecorator('rolename', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="角色描述："
                        >
                            <TextArea rows={4} placeholder="请输入"  id="descripte"/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={'编辑【'+roleName+'】'}
                    visible={this.state.visible2}
                    onOk={this.handleEdit}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    >
                    <Form
                        ref="form"
                        className="flex-column"
                    >
                        <Form.Item
                            {...formItemLayout}
                            label="角色名称："
                        >
                            {getFieldDecorator('roleName', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="角色描述："
                        >
                        {getFieldDecorator('describe', {})(
                                <TextArea rows={4}  />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={'对【'+roleName+'】分配权限'}
                    visible={this.state.visible3}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    >
                    <Tree
                        checkable
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        className="customModal"
                        checkedKeys={this.state.checkedKeys}
                    >
                        {this.renderTreeNodes(this.state.jurisdictionList)}
                    </Tree>

                </Modal>
            </div >
        );
    }
}
export default Form.create()(RoleManage);
