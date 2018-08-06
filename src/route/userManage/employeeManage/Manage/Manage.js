import React, { Component } from 'react';
import {LocaleProvider, Icon, Button, Table, Pagination, Form, Input, Cascader, Menu, Dropdown, Modal, Tooltip, Divider,message } from 'antd';
import $ from 'jquery';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ServerHandle from '../../../../utils/ApiHandle';
//员工管理
const option = [{
    value: '已冻结',
    label: '已冻结'
    }, {
    value: '正常',
    label: '正常'
}];
//安全设置
const securitycolumns = [{
        title: '序号',
        dataIndex: 'id',
    }, {
        title: '所属页面',
        dataIndex: 'belong',
    }, {
        title: '安全说明',
        dataIndex: 'explain',
    }]
    const security = [{
        key: '1',
        id: '1',
        belong: '用户管理-个人用户',
        explain: '查看客户手机号',
    }, {
        key: '2',
        id: '2',
        belong: '用户管理-机构用户',
        explain: '查看所有客户经理',
    }, {
        key: '3',
        id: '3',
        belong: '数据统计-用户数据',
        explain: '查看所有用户数据',
}]
class EmployeeManage extends Component {
    constructor (props){
        super(props);
        this.adminList=this.adminList.bind(this);
        this.sizeChange=this.sizeChange.bind(this);
        this.numChange=this.numChange.bind(this);
        this.addAdmin=this.addAdmin.bind(this);
        this.divide=this.divide.bind(this);
        this.frozen=this.frozen.bind(this);
        this.edit=this.edit.bind(this);
        this.resetPsw=this.resetPsw.bind(this);
        this.distributRole=this.distributRole.bind(this);
        this.safeSet=this.safeSet.bind(this);
        this.handleAdd=this.handleAdd.bind(this);
        this.handleFrozrn=this.handleFrozrn.bind(this);
        this.handleDivide=this.handleDivide.bind(this);
        this.handleEdit=this.handleEdit.bind(this);
        this.handleResetPsw=this.handleResetPsw.bind(this);
        this.handleDistributRole=this.handleDistributRole.bind(this);
        this.handleSafe=this.handleSafe.bind(this);
        this.state={
            addvisible: false,
            frozenvisible: false,
            dividevisible: false,
            editvisible: false,
            resetvisible: false,
            rolevisible: false,
            safevisible: false,
            num:1,
            size:20,
            count:0,
            adminList:[],//员工列表
            adminName:'',//员工姓名
            adminId:0,//员工id
            employeeID:'',//员工工号
            isable:'',//状态
            VIPdivideScale:'',//分成比例
            roleList:[],//角色列表
            isRole:[]//用户已有角色权限
        }
    }
componentDidMount(){
    this.adminList()
}
adminList(){
    let adminMsg=$("#admin").val();
    let status=$(".employeeManage .ant-cascader-picker-label").text();
    ServerHandle.GET({
        url:'/web/user/admin/list',
        data:{
            pageNum:this.state.num,
            pageSize:this.state.size,
            userName:adminMsg,//员工信息
            isable:status === "已冻结" ? '0' : (status==="正常" ? '1' :'')//状态 0-冻结 1-正常
        }
    }).then(result=>{
        this.setState({count:result.count,adminList:result.data})
    })
}
//分页
numChange(page, pageSize) {
    this.setState({
        num: page,
        size: pageSize,
    }, () => { this.adminList()})
}
sizeChange(current, size) {
    this.setState({
        num: current,
        size: size,
    }, () => {this.adminList()})
}
addAdmin = () => {//添加员工
   this.setState({ addvisible:true})
}
handleAdd(){
    let id=$("#employeeID").val();
    let name=$("#userName").val();
    let telphone=$("#telphone").val();
    this.props.form.validateFields((err, values) => {});
    ServerHandle.POST({
        url:'/web/user/admin/add',
        data:{
            employeeID:id,
            userName:name,
            telphone:telphone
        }
    }).then(result=>{
        if(result.success){
        this.setState({confirmLoading:true})            
            setTimeout(()=>{
                this.setState({confirmLoading:false,addvisible:false});
                message.success("添加成功");
                this.adminList();
            },2000);
        }else{
            message.error("添加失败");
        }
    });
}
frozen = (text) => {//冻结/解冻
    console.log(text)
    this.setState({ frozenvisible: true,adminName:text.userName,isable:text.isable ,adminId:text.id});
}
handleFrozrn(){
    if(this.state.isable){//正常-冻结
        ServerHandle.POST({
            url:'/web/user/admin/frozen',
            data:{id:this.state.adminId}
        }).then(result=>{
            if(result.success){
            this.setState({confirmLoading:true});                
                setTimeout(()=>{
                    this.setState({confirmLoading:false,frozenvisible:false})
                    message.success("冻结成功");
                    this.adminList();
                },2000) 
            }else{message.error("冻结失败")}
        })
    }else{//冻结-正常
       ServerHandle.POST({
           url:'/web/user/admin/start',
           data:{id:this.state.adminId}
       }).then(result=>{
        if(result.success){
            this.setState({confirmLoading:true});
            setTimeout(()=>{
                this.setState({confirmLoading:false,frozenvisible:false})
                message.success("解冻成功");
                this.adminList();
            },2000)   
        }else{message.error("解冻失败")}
    })
    }
}
divide(text){//VIP分成
    this.setState({ dividevisible: true,adminId:text.id,VIPdivideScale:text.divideScale,adminName:text.userName },()=>{
        this.props.form.setFieldsValue({divide:text.divideScale})      
    });
}
handleDivide(){
    let divide=$("#divide").val()*1;
    this.props.form.validateFields((err, values) => {});  
    console.log(typeof(divide));  
    console.log(divide)
    if(0<=divide && divide<=1){
        ServerHandle.POST({
            url:'/web/user/admin/setVIP',
            data:{
                id:this.state.adminId,
                divideScale:divide,
            }
            }).then(result=>{
                if(result.success){
                    this.setState({confirmLoading:true});
                    setTimeout(()=>{
                        this.setState({confirmLoading:false,dividevisible:false});
                        message.success("设置成功");
                        this.adminList();
                    },2000);
                }else{
                    message.error("设置失败");
                }
        });
    }else{
        message.error("请输入大于0小于1的数");
    }
    
}
edit(text){//编辑
    this.setState({ editvisible: true,adminId:text.id,adminName:text.userName },()=>{
        this.props.form.setFieldsValue({
            staffId:text.employeeID,
            name:text.userName,
            telphone:text.telphone
        })
    });
}
handleEdit(){
    this.props.form.validateFields((err, values) => {});
    let name=$("#name").val();
    let tel=$("#telphone").val();
    ServerHandle.POST({
        url:'/web/user/admin/update',
        data:{userId:this.state.adminId,userName:name,telphone:tel}
    }).then(result=>{
        if(result.success){
            this.setState({confirmLoading:true},()=>{
                setTimeout(()=>{
                    this.setState({confirmLoading:false,editvisible:false});
                    message.success("编辑成功");
                    this.adminList();
                },2000)
            })
        }else{
            message.error("编辑失败")
        }
    })
}
resetPsw(text){//重置密码
    this.setState({ resetvisible: true,adminId:text.id,adminName:text.userName });
}
handleResetPsw(){
    ServerHandle.POST({
        url:'/web/user/admin/resetPass',
        data:{userId:this.state.adminId}
    }).then(result=>{
        if(result.success){
            this.setState({confirmLoading:true},()=>{
                setTimeout(()=>{
                    this.setState({confirmLoading:false,resetvisible:false});
                    message.success("重置密码成功");
                },2000)
            })
        }else{
            message.error("重置密码失败，请重试")
        }
    })
}
distributRole(text){//分配角色
    this.setState({ rolevisible: true,adminId:text.id,employeeID:text.employeeID,adminName:text.userName});
    ServerHandle.GET({
    url:'/web/permission/role/list',
    data:{pageNum:this.state.num,pageSize:this.state.size}
    }).then(result=>{
        if(result.success){
            this.setState({roleList:result.data},()=>{
                ServerHandle.GET({
                    url:'/web/user/admin/getUserRole',
                    data:{userId:text.id}
                }).then(result=>{
                    if(result.success){
                        this.setState({isRole:result.data})
                        console.log(this.state.isRole)
                    }
                })
            });
        }
    });
}
handleDistributRole(){
    ServerHandle.POST({
        url:'/web/user/admin/updateUserPermission',
        data:{roleIds:this.state.isRole,userId:this.state.adminId,employeeID:this.state.employeeID}
    }).then(result=>{
        if(result.success){
            this.setState({
                confirmLoading:true
            },()=>{
                setTimeout(()=>{
                    this.setState({confirmLoading:false,rolevisible:false});
                    message.success("分配角色成功")
                },2000)
            })
        }else{
            message.error("分配角色失败")
        }
    })
}
safeSet (text) {//安全锁设置
    this.setState({ safevisible: true ,adminId:text.id,adminName:text.userName});
}
handleSafe(){
    ServerHandle.POST({
        url:'/web/user/admin/setSecurity',
        data:{ids:this.state.isRole,userId:this.state.adminId}
    }).then(result=>{
        if(result.success){
            this.setState({
                confirmLoading:true
            },()=>{
                setTimeout(()=>{
                    this.setState({confirmLoading:false,safevisible:false});
                    message.success("设置成功")
                },2000)
            })
        }else{
            message.error("安全设置失败")
        }
    })
}
handleCancel = () => {
    this.setState({
        addvisible: false,
        frozenvisible: false,
        dividevisible: false,
        editvisible: false,
        resetvisible: false,
        rolevisible: false,
        safevisible: false,
    });
}
handleReset = () => {
    this.props.form.resetFields();
}
    render() {
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading,count,adminList,num,size,isable,adminName,roleList,isRole } = this.state;
        const columns = [{
                title: '工号',
                key: 'employeeID',
                render:(text)=>{
                    return text.employeeID || '无'
                }
            }, {
                title: '姓名',
                key: 'userName',
                render:text=>{
                    return text.userName || '无'
                }
            }, {
                title: '联系电话',
                key: 'telphone',
                render:text=>{
                    return text.telphone || '无'
                }
            }, {
                title: 'AQ分成',
                key: 'divideScale',
                render:text=>{
                    return text.divideScale 
                }
            }, {
                title: '角色',
                key: 'roleName',
                render:text=>{
                    return  text.roleName || '-'
                }
            }, {
                title: '账号状态',
                key: 'isable',
                render:text=>{
                    return text.isable === 1 ?'正常':'冻结'
                }
            }, {
                title: '操作',
                key: 'operation',
                render: text => (
                    <Dropdown overlay={
                        <Menu>                        
                        <Menu.Item onClick={()=>{this.frozen(text)}}> 
                            {text.isable===1?'冻结':'解冻'} 
                        </Menu.Item>
                        <Menu.Item onClick={()=>{this.divide(text)}}>VIP分成
                        </Menu.Item>
                        <Menu.Item onClick={()=>{this.edit(text)}}>编辑
                        </Menu.Item>
                        <Menu.Item onClick={()=>{this.resetPsw(text)}}>重置密码
                        </Menu.Item>
                        <Menu.Item onClick={()=>{this.distributRole(text)}}>分配角色
                        </Menu.Item>
                        <Menu.Item onClick={()=>{this.safeSet(text)}}>安全设置
                        </Menu.Item>
                        <Menu.Item onClick={()=>{this.props.history.push('/index/employeeManage/accountFlow',text)}}>账户流水
                        </Menu.Item>
                    </Menu>
                    }>
                        <Button style={{ marginLeft: 8 }}>
                            操作 <Icon type="down" />
                        </Button>
                    </Dropdown>
                )
        }];
        const rolecolumns = [{
                title: '序号',
                key: 'number',
                render:(text,item,key)=>{
                    return  key+1
                }
            }, {
                title: '角色名称',
                key: 'name',
                render:text=>{
                    return text.roleName
                }
            }, {
                title: '角色描述',
                key: 'description',
                render:text=>{
                    return text.description || '-'
                }
            }, {
                title: '状态',
                key: 'status',
                render:text=>{
                    return text.status==='0'?'已停用':'已启动'
                }
        }];
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        //rowSelection分配角色对话框表格选择器
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows){
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({isRole:selectedRowKeys},()=>{
                    console.log(this.state.isRole)
                });
            },
            getCheckboxProps: record=>(console.log(isRole),{
                // checked: record.id===(isRole.forEach(function(item,index,array){
                //     console.log(item,index,array)
                //     // this.setState({isRole:item})
                // })),
                // checked: record.id===isRole.map((value,index)=>{
                //     console.log(value,index);
                //     return value
                // }),
                // roleName:record.roleName,·
            }),
        };
        return (
            <div className="employeeManage">
                <div className="employeeManage-query">
                    <Button type="primary" icon="plus" onClick={this.addAdmin} className="primary-btn">添加员工</Button>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                </div>
                <Form
                    ref="form"
                    className="employeeManage-form form"
                    >
                    <div className="employeeManage-form-input input al-center ">
                        <span className="text-right title-width">员工：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`admin`, {})(
                                <Input placeholder="姓名、联系电话、工号" />
                            )}
                        </span>
                    </div>
                    <div className="employeeManage-form-Cascader cascader al-center">
                        <span className="text-right title-width">状态：</span>
                        <span className="input-width">
                            {getFieldDecorator(`status`, {})(
                                <Cascader options={option} placeholder="请选择" />
                            )}
                        </span>
                    </div>
                    <div className="employeeManage-form-Button">
                        <Button type="primary" htmlType="submit" onClick={this.adminList}>查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    </div>
                </Form>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <div className="tableList">
                    <Table rowKey="id" pagination={false} columns={columns} dataSource={adminList} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共{count}条记录 第 {num} / {Math.ceil(count / size)} 页</span>
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
                <Modal title="添加员工"
                    visible={this.state.addvisible}
                    onOk={this.handleAdd}
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
                            label="工号："
                        >
                            {getFieldDecorator('employeeID', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="姓名："
                        >
                            {getFieldDecorator('userName', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="联系电话："
                        >
                            {getFieldDecorator('telphone', {})(
                                <Input placeholder="请输入" type="number"/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={isable===0?"解冻"+adminName:"冻结【"+adminName+'】'}
                    visible={this.state.frozenvisible}
                    onOk={this.handleFrozrn}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    >
                    <p>{isable===0?"解冻后，员工可正常登陆系统":"冻结后，此员工不可再次登陆"}</p>
                </Modal>
                <Modal title={'【'+adminName+'】设置AQ分成比例'}
                    visible={this.state.dividevisible}
                    onOk={this.handleDivide}
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
                            label="分成比例："
                        >
                            <Tooltip title="AQ平台获取到的利润比例" placement="topLeft">
                                {getFieldDecorator('divide', {
                                    rules: [
                                        { required: true, message: '请输入' },
                                    ],
                                })(
                                    <Input placeholder="0.1800"/>
                                )}
                            </Tooltip>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={'编辑【'+adminName+'】'}
                    visible={this.state.editvisible}
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
                        onSubmit={this.handleOk}
                    >
                        <Form.Item
                            {...formItemLayout}
                            label="工号："
                        >
                          {getFieldDecorator('staffId', {})(
                            <Input disabled/>
                          )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="姓名："
                        >
                            {getFieldDecorator('name', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="联系电话："
                        >
                            {getFieldDecorator('telphone', {})(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={'对【'+adminName+'】重置密码'}
                    visible={this.state.resetvisible}
                    onOk={this.handleResetPsw}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    >
                    <p>确认重置密码为aq123456</p>
                </Modal>
                <Modal title={"对【"+adminName+"】分配角色"}
                    visible={this.state.rolevisible}
                    onOk={this.handleDistributRole}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    width="970px"
                    destroyOnClose="true"
                    >
                    <Table 
                    rowKey="id" 
                    rowSelection={rowSelection} 
                    columns={rolecolumns} 
                    dataSource={roleList} 
                    bordered 
                    pagination={false}          
                     />
                </Modal>
                <Modal title={'对【'+adminName+'】安全设置'}
                    visible={this.state.safevisible}
                    onOk={this.handleSafe}
                    okText="保存"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    width="640px"
                    destroyOnClose="true"
                    >
                    <Table 
                        rowKey="id"
                        rowSelection={rowSelection}
                        columns={securitycolumns}
                        dataSource={security} 
                        bordered 
                        pagination={false}      
                    />
                </Modal>
            </div>
        );
    }
}
export default Form.create()(EmployeeManage);


