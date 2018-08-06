import React, { Component } from 'react';
import { Button, Form, Upload, Icon, Input, Modal, Cascader, Card } from 'antd';
import { Link, } from 'react-router-dom';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import $ from 'jquery';
import ServerHandle from '../../../../utils/ApiHandle';
class Edit extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleReset=this.handleReset.bind(this);
        this.state={
            previewVisible: false,
            previewImage: '',
            rowContent: '',
            fileList: [{
                uid: -1,
                name: '',
                status: 'done',
                url: 'https://aq-images.oss-cn-shenzhen.aliyuncs.com/quantized/20180718/20180718145902985155424.gif',
            }],
        }
    }
    componentDidMount(){
      let id=this.props.location.state.id
        ServerHandle.POST({
            url:'/web/quantized/detail',
            data:{id:id}
        }).then(result=>{
            if(result.success){
                console.log(result)
                $('#managerRealName').val(result.data.managerId);
                $('#title').val(result.data.title);
                $("a.ant-upload-list-item-thumbnail").attr('href',result.data.urlImage);
                $('#urlVideo').val(result.data.urlVideo);
               this.setState({rowContent:result.data.introduction})
            }
        })
    }
    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    handleChange = ({ fileList }) => this.setState({ fileList })
    handleSubmit(e){
        //编辑量化课堂
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
     
       
    }
    handleReset() {
        //取消编辑
        const _this = this;
        this.props.form.resetFields();
        Modal.confirm({
            title: '确定取消编辑课堂？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                _this.props.history.push("/index/quantClassroom");
            },
            onCancel() { },
        })
    }

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    //富文本
    handleChange = (content) => {
        this.setState({ rowContent: content });
    }
    handleRawChange = (rawContent) => {
        // console.log(rawContent)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        const { previewVisible, previewImage, fileList } = this.state;
        //图片上传
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        //富文本
        const editorProps = {
            height: 500,
            contentFormat: 'html',
            initialContent: '<p></p>',
            onChange: this.handleChange,
            onRawChange: this.handleRawChange
        }
        return (
            <div className="AddContent">
                <Form >
                    <Form.Item
                        {...formItemLayout}
                        label="客户经理："
                    >
                        {getFieldDecorator(`managerRealName`, {})(
                            <Input disabled={true}/>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="课堂标题"
                    >
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入' }],
                        })(
                            <Input placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="封面图片："
                    >
                        {getFieldDecorator('urlImage', {
                        })(
                            <div className="clearfix">
                                <Upload
                                 action="/web/oss/ImageUpload/upload"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="视频链接："
                    >
                         {getFieldDecorator('urlVideo', {
                        })(
                            <Input placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="课堂简介："
                    >
                        {getFieldDecorator('introduction', {
                            rules: [{ required: true, message: '请输入' }],
                        })(
                            <Card>
                                <BraftEditor {...editorProps} />
                            </Card>
                        )}
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ span: 8, offset: 2 }}
                    >
                       <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>保存</Button>
                       <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>取消</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
export default Form.create()(Edit);
