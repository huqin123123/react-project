import React, { Component } from 'react';
import { LocaleProvider, Button, Divider, Input, Cascader, Form, Icon, Table, Pagination, Menu, Dropdown, Checkbox, Modal, Row, Col, Radio, message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './strategySelf.css';
import $ from 'jquery';
import ServerHandle from '../../../utils/ApiHandle';
// import Emit from '../../../utils/Emit';

/**自营策略 */
const options = [{
    value: '上架',
    label: '上架'
}, {
    value: '下架',
    label: '下架'
}, {
    value: '弃用',
    label: '弃用'
}];

class StrategySelf extends Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.shelves = this.shelves.bind(this);
        this.disuse = this.disuse.bind(this);
        this.edit = this.edit.bind(this);
        this.share = this.share.bind(this);
        this.bindData = this.bindData.bind(this);
        this.searchStrategy = this.searchStrategy.bind(this);
        this.addAdvider = this.addAdvider.bind(this);
        this.handleshelves = this.handleshelves.bind(this);
        this.disusehandle = this.disusehandle.bind(this);
        this.editHandle = this.editHandle.bind(this);
        this.shareHandle = this.shareHandle.bind(this);
        this.numChange = this.numChange.bind(this);//页码改变
        this.onShowSizeChange = this.onShowSizeChange.bind(this);//每页条数改变
        this.shareSizeChange = this.shareSizeChange.bind(this);
        this.shareNumChange = this.shareNumChange.bind(this);
        this.shareQuery = this.shareQuery.bind(this);
        this.state = {
            //visible对话框是否可见
            modal1visible: false,
            modal2visible: false,
            modal3visible: false,
            modal4visible: false,
            modal5visible: false,
            confirmLoading: false,
            value: 3,
            checked: false, //参与体验
            dataList: [],  //自营策略列表
            count: 0,     //策略列表总数
            shareCount: 0,//分享策略总数
            adviserId: '', //策略id
            adviserName:'',//策略名称
            status: '', //上/下架状态  1-上架 2-下架 3-弃用
            allChecked: '0', //是否推荐所有客户经理id
            managerList: [],   //客户经理对象列表
            userIds: [], //推荐的客户经理id集合
            num:1, //策略列表分页页数
            size: 20,    //策略列表每页条数
            selectedRowKeys: [],
        }
    }
    add(){
        //添加策略
        this.setState({ modal1visible: true, checked: false });
    }
    shelves(text){
        //上/下架
        console.log(text);
        this.setState({ modal2visible: true, adviserId: text.id, status: text.status,adviserName:text.strategyName },
            () => {
                console.log(this.state.adviserId, this.state.status,this.state.adviserName)
            });
    }
    disuse(text){
        //弃用
        this.setState({ modal3visible: true, adviserId: text.id, status: text.status,adviserName:text.strategyName },
            () => {
                console.log(this.state.adviserId, this.state.status)
            });
    }
    edit (text){
        //编辑策略(查询单个策略)
        this.setState({ modal4visible: true, adviserId: text.id,checked:false, adviserName:text.strategyName},
            () => {
                ServerHandle.GET({
                    url: '/web/strategys/getStrategys',
                    data: { id: this.state.adviserId }
                }).then(result => {
                    if (result.success) {
                        this.props.form.setFieldsValue({
                            experience:result.data.experienceDay ,
                            strategyName:result.data.strategyName,
                            publisherName:result.data.publisherName,
                            price:result.data.price,
                            totalPrice:result.data.totalPrice,
                        });
                    }
                })
            });
    }
    share(text) {
        //分享策略分享群体接口
        ServerHandle.GET({
            url:'/web/strategys/pushStrategy',
            data:{strategysId:text.id}
        }).then(result=>{
            if(result.success){
               this.setState({value:result.data.sharingGroup})
            }else{
                this.setState({value:0},()=>{
                    message.error(result.message);
                    $(".ant-modal-footer button").attr("disabled",true);
                })
            }
        })
        //分享策略列表接口        
        let managerMsg = $('#managerMsg').val()
        this.setState({ modal5visible: true, adviserId: text.id,adviserName:text.strategyName });
        ServerHandle.GET({
            url: '/web/strategys/pageStrategysPushVO',
            data: {
                pageNum: this.state.num,
                pageSize: this.state.size,
                managerMsg: managerMsg,
                strategysId:text.id,
            }
        }).then(result => {
            if (result.success) {
                console.log(result.data)
                console.log(result.data[0].pushIds)
                this.setState({ 
                    managerList: result.data, 
                    shareCount: result.count,
                    userIds:result.data[0].pushIds,
                 },()=>{console.log(this.state.userIds)})
            }
        })
    }
    componentDidMount() {    
        this.bindData();
    }
    bindData() {
        //自营策略列表
        let txt = $("#strategy").val();
        let status = $('.strategySelf .ant-cascader-picker-label').text();
        ServerHandle.POST({
            url: '/web/strategys/pageStrategysSelfSupportQueryVO',
            data: { 
                pageNum: this.state.num,
                pageSize: this.state.size, 
                strategyMsg: txt, 
                status: status === "上架" ? 1 : (status === "下架" ? 2 : (status === "弃用") ? 3 : '') 
            }
        }).then(result => {
            if (result.success) {
                this.setState({ dataList: result.data, count: result.count });
                // console.log(result)
            }
        })
    }
    searchStrategy() {
        //策略查询
        this.setState({ num: 1, size: 20 })
        this.bindData();
    }
    addAdvider() {
        //添加策略接口
        this.props.form.validateFields((err, values) => {
        });
        var experience = $('#experienceDay').val();
        var strategyName = $('#strategyName').val();
        var publisherName = $("#publisherName").val();
        var price = $('#price').val();
        var totalPrice = $("#totalPrice").val()
        ServerHandle.POST({
            url: '/web/strategys/addStrategys',
            data: {
                isExperience: this.state.checked ? "1" : "2",
                strategyName: strategyName,
                publisherName: publisherName,
                experienceDay: experience,
                price: price,
                totalPrice: totalPrice,
            }
        }).then(result => {
            if (result.success) {
                this.setState({ confirmLoading: true })
                setTimeout(() => {
                    this.setState({
                        modal1visible: false,
                        confirmLoading: false,
                    });
                    message.success("添加成功");
                    this.bindData();
                }, 2000)
            } else {
                message.error("添加失败");
            }
        })
    }
    handleshelves() {
        //上下架操作
        ServerHandle.POST({
            url: '/web/strategys/shelfDropStrategys',
            data: { id: this.state.adviserId }
        }).then(result => {
            if (result.success) {
                this.setState({
                    confirmLoading: true,
                });
                setTimeout(() => {
                    this.setState({
                        modal2visible: false,
                        confirmLoading: false,
                    });
                    message.success(this.state.status === "上架" ? "下架成功" : "上架成功");
                    this.bindData();
                }, 2000);
            } else {
                message.error(this.state.status === '弃用' ? "禁止操作" : (this.state.status === "上架" ? "下架失败" : "上架失败"))
                this.setState({ modal2visible: false, });
            }
        })
    }
    disusehandle() {
        //弃用操作接口
        ServerHandle.POST({
            url: '/web/strategys/discardStrategys',
            data: { id: this.state.adviserId }
        }).then(result => {
            if (result.success) {
                this.setState({
                    confirmLoading: true,
                });
                setTimeout(() => {
                    this.setState({
                        modal3visible: false,
                        confirmLoading: false,
                    });
                    message.success("弃用成功");
                    this.bindData();
                }, 2000);
            } else {
                message.error(this.state.status === '弃用' ? "禁止操作" : (this.state.status === '上架' ? '请下架再操作弃用' : '弃用失败'));
                this.setState({ modal3visible: false, });
            }
        })
    }
    editHandle(e) {
        //编辑策略接口
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        });
        var experience = $('#experience').val();
        var strategyName = $('#strategyName').val();
        var publisherName = $("#publisherName").val();
        var price = $('#price').val();
        var totalPrice = $("#totalPrice").val()
        ServerHandle.POST({
            url: '/web/strategys/editStrategys',
            data: {
                id: this.state.adviserId,
                isExperience: this.state.checked ? "1" : "2",
                strategyName: strategyName,
                publisherName: publisherName,
                experienceDay: experience,
                price: price,
                totalPrice: totalPrice,
            }
        }).then(result => {
            if (result.success) {
                this.setState({
                    confirmLoading: true,
                });
                setTimeout(() => {
                    this.setState({
                        modal4visible: false,
                        confirmLoading: false,
                    });
                    message.success("编辑成功");
                    this.bindData();
                }, 2000);
            } else {
                message.error("编辑失败");
                // this.setState({modal4visible:false})
            }
        })
    }
    shareHandle() {
        //推送(分享)客户或客户经理策略接口
        // console.log(this.state.allChecked)
        ServerHandle.POST({
            url: '/web/strategys/pushStrategys',
            data: {
                strategysId: this.state.adviserId,
                userIds: this.state.userIds,
                allChecked:this.state.allChecked,
                selectSharing: this.state.value === 3 ? '3' :(this.state.value === 2 ? '2' :'1'),
            }
        }).then(result => {
            if (result.success) {
                console.log(result)
                message.success("分享策略成功");
                setTimeout(()=>{
                    // Emit.emit("target",'/index/strategySelf');
                this.setState({modal5visible: false});                 
                },3000)
            }
        })
    }
    handleCancel = () => {
        this.setState({
            modal1visible: false,
            modal2visible: false,
            modal3visible: false,
            modal4visible: false,
            modal5visible: false,
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    radioChange = (e) => {
        this.setState({
            value: e.target.value,
        });
        if (e.target.value === 1 || e.target.value === 2) {
            $('.onlyready input').addClass('ant-input-disabled');
            $('.ant-checkbox').addClass('ant-checkbox-disabled');
            $('.ant-checkbox-disabled input').attr('disabled', true);
        } else if (e.target.value === 3) {
            $('.onlyready input').removeClass('ant-input-disabled');
            $('.ant-checkbox').removeClass('ant-checkbox-disabled');
            $('.ant-checkbox input').removeAttr('disabled', false);
        }
    }
    //参与体验单选框
    handleCheck = (e) => {
        console.log(e)
        this.setState({
            checked: e.target.checked,
        })
    }
    //策略列表
    numChange(page, pageSize) {
        console.log(page, pageSize)
        this.setState({
            num: page,
            size: pageSize,
        }, () => {
            console.log(this.state.num, this.state.size)
            this.bindData();
        })
    }
    onShowSizeChange(current, size) {
        console.log(current, size)
        this.setState({
            num: current,
            size: size,
        }, () => {
            console.log(this.state.num, this.state.size)
            this.bindData();
        })
    }
    //分享策略
    shareNumChange(page, pageSize) {
        console.log(page, pageSize)
        this.setState({
            num: page,
            size: pageSize,
        }, () => {
            console.log(this.state.num, this.state.size)
            this.showModal5();
        })
    }
    shareSizeChange(current, size) {
        console.log(current, size)
        this.setState({
            num: current,
            size: size,
        }, () => {
            console.log(this.state.num, this.state.size)
            this.showModal5();
        })
    }
    shareQuery() {
        //分享策略查询
        this.setState({ userIds: [] })
        console.log(this.state.adviserId)
        this.showModal5(this.state.adviserId);
        this.setState({ num: 1 })
    }
    // onSelectAll(selected, selectedRows, changeRows){}
    render() {
        const { confirmLoading, dataList, selectedRowKeys,managerList, count, shareCount, status,adviserName } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        }
        const rowSelection = {
            selectedRowKeys,
            hideDefaultSelections: true,
            // onSelect:(record,selected,selectedRows,nativeEvent)=>{
            //     console.log(record,selected,selectedRows,nativeEvent);
            // },
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys,selectedRows)
                this.setState({selectedRowKeys},()=>{
                })
            },
            selections:[{
                key:'checked',
                text:'已分享',
                onSelect:()=>{
                    
                }
            }],
            onSelection: this.onSelection,
        };
        const columns = [{
                title: '策略ID',
                key: 'id',
                render: (text, item) => {
                    return (item.id || '-')
                }
            }, {
                title: '策略名称',
                key: 'strategyName',
                render: (text, item) => {
                    return (item.strategyName || '-')
                }
            }, {
                title: '策略作者',
                key: 'publisherName',
                render: (text, item) => {
                    return (item.publisherName || '-')
                }
            }, {
                title: '分享价格',
                key: 'price',
                render: (text, item) => {
                    return (item.price || '-')
                }
            }, {
                title: '资金容量',
                key: 'totalPrice',
                render: (text, item) => {
                    return (item.totalPrice || '-')
                }
            }, {
                title: '策略分享',
                key: 'share',
                render: (text, item) => {
                    return (item.sharingGroup ||'-')
                }
            }, {
                title: '策略体验',
                key: 'experienceDay',
                render: (text, item) => {
                    return (!(item.experienceDay) ? "无" : item.experienceDay)
                }
            }, {
                title: '添加日期',
                key: 'date',
                render: (text, item) => {
                    return (item.createTime || '-')
                }
            }, {
                title: '状态',
                key: 'status',
                render: (text, item) => {
                    return (item.status)
                }
            }, {
                title: '操作',
                key: 'operation',
                render: text => (
                    <Dropdown disabled={text.status === "弃用"} overlay={
                        <Menu>
                            <Menu.Item onClick={() => {this.shelves(text); }}>{text.status ==="下架"?"上架" :"下架"}
                            </Menu.Item>
                            <Menu.Item onClick={() => { this.disuse(text)}}>弃用
                            </Menu.Item>
                            <Menu.Item onClick={() => { this.edit(text) }}>编辑
                            </Menu.Item>
                            <Menu.Item onClick={() => { this.share(text) }} >分享
                            </Menu.Item>
                        </Menu>
                    }>
                        <Button style={{ marginLeft: 8 }}>
                            操作 <Icon type="down" />
                        </Button>
                    </Dropdown>
                )
        }];
        const columnsM = [{
                title: '序号',
                key: "number",
                render: (text, item, key) => { return key + 1 }
            }, {
                title: '真实姓名',
                key: 'realName',
                render: (text) => {
                    return (text.realName || '-')
                }
            }, {
                title: '登录手机',
                key: 'telphone',
                render: (text) => {
                    return (text.telphone || '-')
                }
            }, {
                title: '分享状态',
                key: 'pushIds',
                render: (text) => {
                    //text.pushIds策略分享过的客户经理id
                    //text.id客户经理id
                    let pushIds =text.pushIds;
                    return (pushIds.indexOf(text.id) === -1 ? "-" : "已分享")
                    // return ( text.id )
                    
                }
        }];
        return (
            <div className="strategySelf">
                <div className="strategy-query">
                    <Button type="primary" icon="plus" onClick={this.add} className="primary-btn">添加策略</Button>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                </div>
                <Form
                        ref="form"
                        className="strategy-form form"
                    >
                    <div className="strategy-form-input  al-center ">
                        <span className="text-right title-width">策略：</span>
                        <span className="input-width" >
                            {getFieldDecorator(`strategy`, {})(
                                <Input placeholder="请输入策略名称或ID" />
                            )}
                        </span>
                    </div>
                    <div className="strategy-form-Cascader cascader al-center ">
                        <span className="text-right title-width">状态：</span>
                        <span className="input-width">
                            {getFieldDecorator(`status`, {})(
                                <Cascader options={options} placeholder="请选择" />
                            )}
                        </span>
                    </div>
                    <div className="strategy-form-Button">
                        <Button type="primary" htmlType="submit" onClick={this.searchStrategy}>查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    </div>
                </Form>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <div className="tableList strategyTable">
                    <Table  rowKey="id" id="strategyTable" pagination={false} columns={columns} dataSource={dataList} bordered  />
                </div>
                <div className="Statistics">
                    <span className="total">共{count}条记录 第 {this.state.num} / {Math.ceil(count / this.state.size)} 页</span>
                    <span className="Pagination text-right">
                        <LocaleProvider locale={zhCN}>
                            <Pagination
                                total={count}
                                showSizeChanger={true}
                                showQuickJumper={true}
                                hideOnSinglePage={false}
                                current={this.state.num}
                                pageSize={this.state.size}
                                onChange={this.numChange}
                                onShowSizeChange={this.onShowSizeChange}
                            />
                        </LocaleProvider>
                    </span>
                </div>
                {/* 对话框 */}
                <Modal title="添加策略"
                    visible={this.state.modal1visible}
                    onOk={this.addAdvider}
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
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            label="免费体验："
                        >
                            <Row gutter={12}>
                                <Col span={17}>
                                    {getFieldDecorator('experienceDay', {
                                        rules: [{
                                            required: false,
                                            message: '请输入'
                                        }],
                                    })(
                                        <Input type='number' placeholder="请输入" disabled={this.state.checked ? false : true} />
                                    )}
                                </Col>
                                <Col span={7}>
                                    <Checkbox ref="check" checked={this.state.checked} onChange={this.handleCheck}>参与体验</Checkbox>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="策略名称："
                        >
                            {getFieldDecorator('strategyName', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="策略作者："
                        >
                            {getFieldDecorator('publisherName', {
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
                            label="分析价格："
                        >
                            <Row gutter={12}>
                                <Col span={17}>
                                    {getFieldDecorator('price', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <Input type='number' placeholder="请输入" />
                                    )}
                                </Col>
                                <Col span={7}>
                                    <span>/月</span>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="资金容量："
                        >
                            {getFieldDecorator('totalPrice', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input type='number' placeholder="请输入" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={'【'+adviserName+'】'+(status ==="下架"?"上架操作" :"下架操作")}
                    visible={this.state.modal2visible}
                    onOk={this.handleshelves}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    >
                    <p>确认{status === "下架" ? "上架" : "下架"}策略？</p>
                </Modal>
                <Modal title={'【'+adviserName+'】弃用操作'}
                        visible={this.state.modal3visible}
                        onOk={this.disusehandle}
                        okText="确认"
                        confirmLoading={confirmLoading}
                        onCancel={this.handleCancel}
                        cancelText="取消"
                    >
                    <p>弃用后，不可再次恢复使用</p>
                </Modal>
                <Modal title={'编辑策略【'+adviserName+'】'}
                        visible={this.state.modal4visible}
                        onOk={this.editHandle}
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
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            label="免费体验："
                        >
                            <Row gutter={12}>
                                <Col span={17}>
                                    {getFieldDecorator('experience', {
                                        rules: [{
                                            required: this.state.checked,
                                            message: '请输入'
                                        }],
                                    })(
                                        <Input type='number' placeholder="请输入" disabled={this.state.checked ? false : true} />
                                    )}
                                </Col>
                                <Col span={7}>
                                    <Checkbox ref="check" checked={this.state.checked} onChange={this.handleCheck}>参与体验</Checkbox>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="策略名称："
                        >
                            {getFieldDecorator('strategyName', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="策略作者："
                        >
                            {getFieldDecorator('publisherName', {
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
                            label="分析价格："
                        >
                            <Row gutter={12}>
                                <Col span={17}>
                                    {getFieldDecorator('price', {
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <Input type='number' placeholder="请输入" />
                                    )}
                                </Col>
                                <Col span={7}>
                                    <span>/月</span>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="资金容量："
                        >
                            {getFieldDecorator('totalPrice', {
                                rules: [
                                    { required: true, message: '请输入' },
                                ],
                            })(
                                <Input type='number' placeholder="请输入" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={'分享策略【'+adviserName+'】'}
                        visible={this.state.modal5visible}
                        onOk={this.shareHandle}
                        okText="确认分享"
                        confirmLoading={confirmLoading}
                        onCancel={this.handleCancel}
                        cancelText="取消"
                        width={900}
                        destroyOnClose={true} 
                    >
                    <Radio.Group onChange={this.radioChange} value={this.state.value}>
                        <Radio value={1}>所有用户</Radio>
                        <Radio value={2}>所有机构</Radio>
                        <Radio value={3}>选择指定机构</Radio>
                    </Radio.Group>
                    <Form
                        ref="form"
                        className="modal-form form onlyready"
                    // onSubmit={this.handleSearch}
                    >
                        <div className=" input al-center ">
                            <span className="text-right title-width">机构用户：</span>
                            <span className="input-width" >
                                {getFieldDecorator(`managerMsg`, {})(
                                    <Input placeholder="请输入" />
                                )}
                            </span>
                        </div>
                        <div className="modal-btn">
                            <Button type="primary" htmlType="submit" onClick={this.shareQuery}>查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </div>
                    </Form>
                    <Table 
                        rowKey="id"
                        pagination={false}
                        rowSelection={rowSelection}
                        columns={columnsM} 
                        dataSource={managerList}
                        className="checkedtable" 
                       />
                    <div className="Statistics">
                        <span className="total">共{shareCount}条记录 第 {this.state.num} / {Math.ceil(shareCount / this.state.size)}页</span>
                        <span className="Pagination text-right">
                            <LocaleProvider locale={zhCN}>
                                <Pagination
                                    total={shareCount}
                                    showSizeChanger={true}
                                    showQuickJumper={true}
                                    hideOnSinglePage={false}
                                    current={this.state.num}
                                    pageSize={this.state.size}
                                    onChange={this.shareNumChange}
                                    onShowSizeChange={this.shareSizeChange}
                                />
                            </LocaleProvider>
                        </span>
                    </div>
                </Modal>
            </div >
        );
    }
}
export default Form.create()(StrategySelf);