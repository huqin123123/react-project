import React, { Component } from 'react';
import './combinationManage.css';
import { LocaleProvider, Icon, Button, Table, Pagination, Form, Input, Cascader, DatePicker, Menu, Dropdown, Modal, Divider,message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ServerHandle from '../../../utils/ApiHandle';
import $ from 'jquery';
const option1 = [{
    value: '下架',
    label: '下架'
}, {
    value: '上架',
    label: '上架'
}];
const option2 = [{
    value: '所有用户',
    label: '所有用户'
}, {
    value: '所有机构',
    label: '所有机构'
}];
class CombinationManage extends Component {
    constructor(props) {
        super(props);
        this.bindData = this.bindData.bind(this);
        this.numChange=this.numChange.bind(this);
        this.onShowSizeChange=this.onShowSizeChange.bind(this);
        this.state = {
            visible1: false,
            visible2: false,
            confirmLoading: false,
            //投顾列表
            dataList: [],
            //投顾总数
            count:0,
            //投顾ID
            adviserId: [],
            //投顾状态
            visible:'',
            //投顾分享
            adviserShare:'',
            //页码
            num:1,
            //每页条数
            size:20,

        };
    }
    /**
     * bindData分页获取投顾列表
     */
    componentDidMount() {
        this.bindData();
    }
    bindData() {
        let queryName = $('#queryName').val();
        let createTimeStart=$('#createTimeStart  input').val();
        let createTimeEnd= $('#createTimeEnd  input').val();
        let sharingGroup=$('.combinationManageShare .ant-cascader-picker-label').text()
        let adviserName=$('#adviserName').val();
        let isVisible=$('.combinationManageStatus .ant-cascader-picker-label').text();
        console.log(queryName,createTimeStart,createTimeEnd,sharingGroup,adviserName,isVisible);
        ServerHandle.GET({
            url: '/web/adviser/list',
            data: {
                pageNum: this.state.num,
                pageSize: this.state.size,
                adviserName:adviserName,
                createTimeStart:createTimeStart,
                createTimeEnd:createTimeEnd,
                isVisible:isVisible === "上架" ? 1 : (isVisible === "下架" ? 2 : ''),
                sharingGroup:sharingGroup === "所有用户" ? 1 : (sharingGroup === "所有机构" ? 1 : ''),
                queryName:queryName,
            }
        }).then(result => {
            if (result.success) {
                console.log(result)
                this.setState({ dataList: result.data ,count:result.count})
            }
        })
    }
    handleQuery = (e) => {
        //组合管理查询
        this.bindData()
    }
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({
            startValue: null,
            endValue: null,
        });
    }
    handleOk = (e) => {
        //确定上下架操作
        ServerHandle.POST({
            url:'/web/adviser/isVisible',
            data:{id:this.state.adviserId,isVisible:this.state.visible === 1 ? 2 :1}
        }).then(result=>{
            if(result.success){
                console.log(result)
                console.log(this.state.visible)
                this.setState({
                    confirmLoading: true,
                });
                setTimeout(() => {
                    this.setState({
                        visible1: false,
                        confirmLoading: false,
                    });
                    message.success(this.state.visible === 1 ? "下架成功" : "上架成功");
                    this.bindData();//加载投顾列表接口
                }, 2000);

            }else{
                message.error(this.state.visible === 1 ? "下架失败" : "上架失败");
            }
        })
 
    }
    handleShareOk = (e) => {
        //确定分享投顾操作
        ServerHandle.POST({
            url:'/web/adviser/sharing',
            data:{id:this.state.adviserId,sharingGroup:this.state.adviserShare === 1 ? 2 : 1}
        }).then(result=>{
            if(result.success){
                this.setState({
                    confirmLoading: true,
                });
                setTimeout(() => {
                    this.setState({
                        visible2: false,
                        confirmLoading: false,
                    });
                    message.success("分享成功");
                    this.bindData();//加载投顾列表接口
                }, 2000);
            }else{
                message.error("分享失败")
            }
        })
    }
    handleCancel = () => {
        this.setState({
            visible1: false,
            visible2: false,
        });
    }
    showModal1 = (id,state) => {
        /**
         * 上下架
         * id(投顾id)
         * state(1上架，2下架)
         */
        console.log(id,state)
        this.setState(
            { visible1: true, adviserId: id,visible:state }
            , () => {
                console.log(this.state.adviserId)
                console.log(this.state.visible)
             });
    }
    showModal2 = (id,share) => {
        /**
         * 分享投顾
         * id-投顾id
         * share-投顾分享(1所有用户，2所有机构)
         */
        this.setState({ visible2: true ,adviserId:id,adviserShare:share},
        ()=>{
            console.log(this.state.adviserId)
            console.log(this.state.adviserShare)
        });
    }
    //组合管理分页
    numChange(page, pageSize) {
        console.log(page, pageSize)
        this.setState({
            num: page,
            size: pageSize,
        }, () => {
            console.log(this.state.num, this.state.size);
            this.bindData();
        })
    }
    onShowSizeChange(current, size) {
        console.log(current, size)
        this.setState({
            num: current,
            size: size,
        }, () => {
            console.log(this.state.num, this.state.size);
            this.bindData();
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const columns = [{
                title: '序号',
                key: 'num',
                render: (text, item, key) => {
                    return key + 1
                }
            }, {
                title: '创建时间',
                key: 'createTime',
                render: (text, item) => {
                    return (item.createTime || '-')
                }
            }, {
                title: '投顾名称',
                key: 'adviserName',
                render: (text, item) => {
                    return (item.adviserName || '-')
                }
            }, {
                title: '创建人',
                key: 'managerName',
                render: (text, item) => {
                    return (item.managerName || '-')
                }
            }, {
                title: '开始日期',
                key: 'startTime',
                render: (text, item) => {
                    return (item.startTime || '-')
                }
            }, {
                title: '分享价格',
                key: 'price',
                render: (text, item) => {
                    return (item.price || '-')
                }
            }, {
                title: '投顾分享',
                key: 'sharingGroup',
                render: (text, item) => {
                    return (
                        item.sharingGroup === 1 ? "所有用户" : "所有机构"
                    )
                }
            }, {
                title: '状态',
                key: 'isVisible',
                render: (text, item) => {
                    return (
                        item.isVisible === 1 ? "上架" : "下架"
                    )
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                render: (text, item) => {
                    return (
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item>
                                    <a onClick={() => { this.showModal1(item.id,item.isVisible)}}>上下架</a>
                                </Menu.Item>
                                <Menu.Item>
                                    <a onClick={() => { this.showModal2(item.id,item.sharingGroup) }}>分享</a>
                                </Menu.Item>
                            </Menu>
                        }>
                            <Button style={{ marginLeft: 8 }}>
                                操作 <Icon type="down" />
                            </Button>
                        </Dropdown>
                    )
                }
        }];
        const { confirmLoading, dataList,count } = this.state;
        return (
            <div className="customerList">
                <Form
                    ref="form"
                    className="flex-column"
                    onSubmit={this.handleSearch}
                >
                    <div className="formdiv formspace">
                        <div className=" al-center flex flex-row ">
                            <span className="text-right title-width4">创建人：</span>
                            <span className="input-width">
                                {getFieldDecorator('queryName', {})(
                                    <Input placeholder="请输入姓名或电话" />
                                )}
                            </span>
                        </div>
                        <div className="flex al-center flex-row ">
                            <span className=" text-right title-width4">创建日期：</span>
                            <span>
                                    <LocaleProvider locale={zhCN} >
                                        {getFieldDecorator('createTimeStart', {})(
                                            <DatePicker />
                                        )}
                                    </LocaleProvider >-
                                    <LocaleProvider locale={zhCN} >
                                        {getFieldDecorator('createTimeEnd', {})(
                                            <DatePicker />
                                        )}
                                    </LocaleProvider >
                            </span>
                        </div>
                        <div className="al-center flex flex-row ">
                            <span className="text-right title-width">投顾分享：</span>
                            <span className="input-width combinationManageShare">
                                {getFieldDecorator(`sharingGroup`, {})(
                                    <Cascader options={option2} placeholder="请选择" />
                                )}
                            </span>
                        </div>
                    </div>
                    <div className=" formdiv">
                        <div className="al-center flex flex-row ">
                            <span className="text-right title-width4">投顾名称：</span>
                            <span className="input-width">
                                {getFieldDecorator(`adviserName`, {})(
                                    <Input  placeholder="请输入" />
                                )}
                            </span>
                        </div>
                        <div className="al-center flex flex-row ">
                            <span className="text-right title-width">状态：</span>
                            <span className="input-width combinationManageStatus">
                                {getFieldDecorator(`isVisible`, {})(
                                    <Cascader options={option1} placeholder="请选择" />
                                )}
                            </span>
                        </div>
                        <div className="text-left flex flex-row">
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
                <Modal title="【组合名称】上下架操作"
                    visible={this.state.visible1}
                    onOk={this.handleOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认上架/下架策略？</p>
                </Modal>
                <Modal title="【组合名称】分享操作"
                    visible={this.state.visible2}
                    onOk={this.handleShareOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认分享此组合给{this.state.adviserShare === 1 ? "所有机构" : "所有用户"}？</p>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(CombinationManage);


