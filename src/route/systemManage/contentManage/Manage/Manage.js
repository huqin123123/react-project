import React, { Component } from 'react';
import {LocaleProvider, Dropdown, Menu, Icon, Table, Pagination, Modal, Button, Divider,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ServerHandle from '../../../../utils/ApiHandle';

 export default  class Manage extends Component {
     constructor(props){
         super(props);
         this.forzen=this.forzen.bind(this);
         this.dataList=this.dataList.bind(this);
         this.numChange=this.numChange.bind(this);
         this.sizeChange=this.sizeChange.bind(this);
         this.handeleForzen=this.handeleForzen.bind(this);
         this.state={
            visible: false,
            num:1,
            size:20,
            dataList:[],
            count:0,
            contentId:0,
            contentTitle:'',
            status:'',
         }
     }
     componentDidMount(){
         this.dataList();
     }
    dataList(){
        ServerHandle.GET({
            url:'/web/system/content/list',
            data:{
                pageNum:this.state.num,
                pageSize:this.state.size,
            }
        }).then(result=>{
            if(result.success){
                console.log(result.data)
                this.setState({
                    dataList:result.data,count:result.count
                });
            }
        });
    }
    //分页
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
    forzen(id,status,title){//冻结/解冻
        this.setState({ visible: true,contentId:id,status:status,contentTitle:title });
    }
    handeleForzen (){
        if(this.state.status===1){
           ServerHandle.POST({
               url:'/web/system/content/frozen',
               data:{id:this.state.contentId}
           }).then(result=>{
               if(result.success){
                this.setState({
                    confirmLoading: true,
                },()=>{
                    setTimeout(() => {
                        this.setState({
                            visible: false,
                            confirmLoading: false,
                        });
                        message.success("冻结成功")
                        this.dataList();
                    }, 2000);
                });
               }else{
                   message.error("冻结失败")
               }
           })
        }else{
            ServerHandle.POST({
                url:'/web/system/content/start',
                data:{id:this.state.contentId}
            }).then(result=>{
                if(result.success){
                 this.setState({
                     confirmLoading: true,
                 },()=>{
                     setTimeout(() => {
                         this.setState({
                             visible: false,
                             confirmLoading: false,
                         });
                         message.success("解冻成功")
                         this.dataList();
                     }, 2000);
                 });
                }else{
                    message.error("解冻失败")
                }
            })
        }
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }
    render() {
        const columns = [{
                title: '序号',
                key: 'number',
                render:(text,item,key)=>{
                    return key+1
                }
            }, {
                title: '内容版块',
                key: 'name',
                render:text=>{
                    return text.name
                }
            }, {
                title: '内容标题',
                key: 'title',
                render:text=>{
                    return text.title
                }
            }, {
                title: '状态',
                key: 'status',
                render:text=>{
                    return text.status===0?'冻结':(text.status===1?'正常':'')
                }
            }, {
                title: '操作',
                key: 'operation',
                render: text => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item onClick={()=>{this.forzen(text.id,text.status,text.title)}}>{text.status===1?'冻结':(text.status===0?'解冻':'')}
                            </Menu.Item>
                            <Menu.Item onClick={()=>{this.props.history.push('/index/contentManage/editContent',text)}}>编辑内容
                            </Menu.Item>
                        </Menu>
                    }>
                        <Button style={{ marginLeft: 8 }}>
                            操作 <Icon type="down" />
                        </Button>
                    </Dropdown>
                )
        }];
        const { confirmLoading,num,visible,size,count,dataList,status,contentTitle } = this.state;
        return (
            <div className="contentManage">
                <div className="contentManage-query">
                   <Button type="primary" icon="plus" className="primary-btn" onClick={()=>{this.props.history.push('/index/contentManage/addContent')}}>添加内容</Button>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                </div>
                <div className="tableList">
                    <Table rowKey="id" pagination={false} columns={columns} dataSource={dataList} bordered />
                </div>
                <div className="Statistics">
                    <span className="total">共 {count}条记录 第 {num} / {Math.ceil(count/size)}页</span>
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
                <Modal title={'【'+contentTitle+'】'+(status===1?'冻结':(status===0?'解冻':''))+'操作'}
                    visible={visible}
                    onOk={this.handeleForzen}
                    okText="确认"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                >
                    <p>确认{status===1?'冻结':(status===0?'解冻':'')}内容？</p>
                </Modal>
            </div>
        );
    }
}
