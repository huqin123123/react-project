import React, { Component } from 'react';
import { Button, Input,Cascader,Table,Form,Pagination} from 'antd';
import './relatedStare.css';
const option1 =[{
    value:'网络',
    label:'网络',
},{
    value:'趋势量化',
    label:'趋势量化'
},{
    value:'专用趋势',
    label:'专用趋势'
},{
    value:'买卖点',
    label:'买卖点'
}];
const option2=[{
    value:'已完善',
    label:'已完善',
},{
    value:'待完善',
    label:'待完善',
}]
const columns=[{
    title:'序号',
    dataIndex:'id'
},{
    title: '添加时间',
    dataIndex: 'time',
},{
    title: '股票代码',
    dataIndex: 'code',
},{
    title: '股票名称',
    dataIndex: 'name',
},{
    title: '客户',
    dataIndex: 'customer',
},{
    title: '客户经理',
    dataIndex: 'manager',
},{
    title: '类别',
    dataIndex: 'type',
},{
    title: '状态',
    dataIndex: 'state',
}];
const data =[{
    key:'1',
    id:'1',
    time:'2018-04-05 10:15:25',
    code:'000001',
    name:'平安银行',
    customer:'-',
    manager:'152***456',
    type:'网络',
    state:'已完善'
},{
    key:'2',
    id:'2',
    time:'2018-04-05 10:15:25',
    code:'600000',
    name:'浦发银行',
    customer:'189***1634',
    manager:'-',
    type:'趋势量化',
    state:'待完善'
},{
    key:'3',
    id:'3',
    time:'2018-04-05 10:15:25',
    code:'000009',
    name:'中国宝安',
    customer:'189***1635',
    manager:'152***456',
    type:'专用趋势量化',
    state:'待完善'
}];
 class RelatedStare extends Component {
    state = {}
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        console.log('Received values of form: ', values);
        });
      }
      handleReset = () => {
        this.props.form.resetFields();
    }
    render() {
    const { getFieldDecorator } = this.props.form;        
        return (
            <div className="relatedStare">
             <Form
                ref="form"
                className="flex-column"
                onSubmit={this.handleSearch}
                    >
                    <div className="formdiv">
                        <div className=" al-center list-width ">
                            <span className=" text-right title-width">客户：</span>
                            <span className="input-width" >
                                    {getFieldDecorator(`field-${2}`, {})(
                                    <Input placeholder="请输入手机号"/>
                                    )}
                                </span>   
                        </div>
                        <div className="al-center flex flex-row ">
                            <span className="text-right title-width">客户经理：</span>
                            <span className="input-width" >
                                    {getFieldDecorator(`field-${2}`, {})(
                                    <Input placeholder="请输入手机号"/>
                                    )}
                                </span>   
                        </div>
                    </div>   
                    <div className="formdiv form-row">
                        <div className="al-center list-width ">
                                <span className="text-right title-width">类别：</span>
                                <span className="input-width">
                                {getFieldDecorator(`field-${3}`, {})(
                                            <Cascader options={option1} placeholder="请选择" />
                                        )}
                                </span>
                            </div>  
                        <div className="al-center flex flex-row">
                            <span className="text-right title-width">状态：</span>
                            <span className="input-width">
                            {getFieldDecorator(`field-${3}`, {})(
                                        <Cascader options={option2} placeholder="请选择" />
                                    )}
                            </span>
                        </div> 
                        <div className="relatedStare-form-Button">
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>                          
                        </div> 
                    </div>                    
                    </Form>
                    <div className="tableList">
                        <Table pagination={false} columns={columns} dataSource={data} bordered /> 
                    </div>  
                    <div className="Statistics">
                            <span className="total">共 400 条记录 第 1 / 80 页</span>
                            <span className="Pagination text-right">
                                <Pagination total={50} showSizeChanger showQuickJumper hideOnSinglePage />
                            </span>                   
                     </div>
            </div>
        );
    }
}
export default Form.create()(RelatedStare);