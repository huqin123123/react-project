import React, { Component } from 'react';
import { LocaleProvider, Dropdown, Menu, Icon, Table, Pagination, Modal, Button, Divider, message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ServerHandle from '../../../../utils/ApiHandle';
export default class Manage extends Component {
    /**
     * pagenumChange页码改变回调
     * pagesizeChange每页条数改变回调
     * @param {pagenumChange} props 
     * bindData分页接口
     *
     */
    constructor(props) {
        super(props);
        this.showModal = this.showModal.bind(this);
        this.bindData = this.bindData.bind(this);
        this.numChange=this.numChange.bind(this);
        this.onShowSizeChange=this.onShowSizeChange.bind(this);
        this.addQuantClassroom=this.addQuantClassroom.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.state = {
            visible: false,
            //客户经理信息
            dataList: [],
            //当前页数
            num:1,
            //每页条数            
            size:20,
            //客户经理id
            // id: [],
            onOkId: null,
            //量化课堂总数
            count:0,
        }
    }
   
    componentDidMount() {
        this.bindData();
    }
    bindData() {
        //列表数据
        console.log(this.state.num,this.state.size)
        ServerHandle.GET(
            {
                url: `/web/quantized/list`,
                data: { pageNum: this.state.num, pageSize: this.state.size },
            }
        ).then(result => {
            if (result.success) {
                this.setState({ dataList: result.data,count:result.count});
                console.log(this.state.dataList,this.state.count);
                console.log(result.data,result.count)
            }
        })
    }
    numChange(page, pageSize) {
        console.log(page, pageSize)
        this.setState({
            num: page,
            size: pageSize,
        }, () => {
            this.bindData();
        })
    }
    onShowSizeChange(current, size) {
        console.log(current, size)
        this.setState({
            num: current,
            size: size,
        }, () => {
            this.bindData();
        })
    }
    showModal(id) {
        //冻结/解冻
        console.log(id)
        this.setState({ visible: true, onOkId: id });
    }
    addQuantClassroom(){
        console.log(this);
        this.props.history.push('/index/quantClassroom/add');
        console.log(this);
    }
    handleOk = (e) => {
        // 量化课堂状态冻结解冻接口
        console.log(e)
        ServerHandle.POST({
            url: '/web/quantized/update/status',
            data: { id:  this.state.onOkId}
        }).then(result => {
            if (result.success) {
                this.setState({
                    confirmLoading: true,
                });
                setTimeout(() => {
                    this.setState({
                        visible: false,
                        confirmLoading: false,
                    });
                    message.success('修改成功');
                    this.bindData();
                }, 2000);
            } else {
                message.error("修改失败，请重新操作");
            }
        })
    }
    handleCancel() {
        this.setState({
            visible: false,
        })
    }
    render() {
        const columns = [{
                title: '序号',
                key: 'num',
                render: (text, item, key) => {
                    return key + 1
                }

            }, {
                title: '发布时间',
                key: 'publishTime',
                render: (text, item) => {
                    return (
                        item.publishTime || '-'
                    )
                }
            }, {
                title: '课堂标题',
                key: 'title',
                render:(text,item)=>{
                    return(item.title || '-')
                }
            }, {
                title: '客户经理',
                key: 'managerRealName',
                render: (text, item) => {
                    return (
                        item.managerRealName || "-"
                    )
                }
            }, {
                title: '手机号',
                key: 'managerTelphone',
                render: (text, item) => {
                    return (
                        item.managerTelphone || '-'
                    )
                }
            }, {
                title: '状态',
                key: 'status',
                render: (text, item) => {
                    return (
                        item.status === 1 ? "正常" : "冻结"
                    )
                }
            }, {
                title: '操作',
                key: 'operation',
                render: text => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item onClick={() => {
                                 this.showModal(text.id) }}>冻结/解冻
                            </Menu.Item>
                            <Menu.Item onClick={()=>{
                                this.props.history.push('/index/quantClassroom/edit',text);console.log(text)}}>编辑</Menu.Item>
                        </Menu>
                    }>
                        <Button style={{ marginLeft: 8 }}>
                            操作 <Icon type="down" />
                        </Button>
                    </Dropdown>
                )
        }];
        const { confirmLoading, dataList,count,num,size} = this.state;
        console.log(num,size)
        return (
            <div className="contentManage">
                <div className="contentManage-query">
                    <Button type="primary" icon="plus" className="primary-btn" onClick={this.addQuantClassroom}>添加课堂</Button>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                </div>
                <div className="tableList">
                    <Table rowKey="id" pagination={false} columns={columns} dataSource={dataList} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共 {count}条记录 第  {num} / {Math.ceil(count /size)} 页</span>
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
                <Modal title="【内容标题】冻结/解冻操作"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    >
                    <p>确认冻结/解冻内容？</p>
                </Modal>
            </div>
        );
    }
}
