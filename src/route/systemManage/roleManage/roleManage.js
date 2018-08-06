import React, { Component } from 'react';
import {LocaleProvider, Button, Divider, Input, Modal, Form, Icon, Table, Pagination, Menu, Dropdown, Tree,message } from 'antd';
import './roleManage.css';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import $ from 'jquery';
import ServerHandle from '../../../utils/ApiHandle';
import Emit from '../../../utils/Emit';
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
            // 自动展开父节点
            autoExpandParent: true,
            //（受控）设置选中的树节点
            selectedKeys: [],
            //分页页码，条数
            num:1,
            size:20,
            count:0,
            roleList:[],
            roleId:0,
            //权限列表
            jurisdictionList:[],
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
    showModal2(id,name,description) {
        this.setState({
            visible2: true,
            roleId:id,
            roleName:name,
            description:description,
        },()=>{
            $('#roleName').val(name);
            $('#describe').val(description);
        });
    }
    //分配权限
    showModal3(id) {
        this.setState({
            visible3: true,
            roleId:id,
        },()=>{
            ServerHandle.GET({
                url:'/web/permission/role/getRoleMenu',
                data:{roleId:id}
            }).then(result=>{
                if(result.success){
                    this.setState({jurisdictionList:result.data},
                        ()=>{ console.log(this.state.jurisdictionList)})
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
                "menuTreeVOS":[{
                    'btnId':0,
                    'checked':false,
                    'id':0,
                    'name':'string',
                    'open':'true',
                    'parentId':0
                }],
                "roleId":this.state.roleId,
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
    onCheck = (checkedKeys) => {
        // console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }
    onSelect = (selectedKeys, info) => {
        // console.log('onSelect', info);
        this.setState({ selectedKeys });
    }

    renderTreeNodes = (data) => {
        var map = {},
        dest = [];
        for(var i = 0; i < data.length; i++){
            var ai = data[i];
            if(!map[ai.parentId]){
                dest.push({
                    parentId: ai.parentId,
                    children: [ai]
                });
                map[ai.parentId] = ai;
            }else{
                for(var j = 0; j < dest.length; j++){
                    var dj = dest[j];
                    if(dj.parentId === ai.parentId){
                        dj.children.push(ai);
                        break;
                    }
                }
            }
        }
       
        return dest.map((item) => {
           console.log(item.children)
            if (item.children) {
                return (
                    <Tree.TreeNode title={item.children[0].name} key={item.children.id} dataRef={item.children}>
                        {/* {this.renderTreeNodes(item.children)} */}
                    </Tree.TreeNode>
                );
            }
            return <Tree.TreeNode {...item} />;
        });
    }
    render() {
        const { confirmLoading,roleList,count,num,size } = this.state;
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
                            <Menu.Item>
                                <a onClick={()=>{this.showModal2(text.id,text.roleName,text.description)}}>编辑</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a onClick={()=>{this.showModal3(text.id)}}>分配权限</a>
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
                        // onSubmit={this.handleOk}
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
                <Modal title="编辑【角色名称】"
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
                        // onSubmit={this.handleOk}
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
                            <TextArea rows={4}  id="describe"/>
                        </Form.Item>

                    </Form>
                </Modal>
                <Modal title="对【角色名称】分配权限"
                    visible={this.state.visible3}
                    onOk={this.handleOk}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    >
                    <Tree
                        checkable
                        // onExpand={this.onExpand}
                        // expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        // checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                        selectedKeys={this.state.selectedKeys}
                        className="customModal"
                    >
                        {this.renderTreeNodes(this.state.jurisdictionList)}
                    </Tree>

                </Modal>
            </div >
        );
    }
}
export default Form.create()(RoleManage);
