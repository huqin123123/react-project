import React, { Component } from 'react';
import { Button, Form, Upload, Icon, Input, Modal, Card,message } from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import $ from 'jquery';
import ServerHandle from '../../../../utils/ApiHandle';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
class Edit extends Component {
    constructor(props) {
        super(props);
        this.bindData = this.bindData.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.state = {
            loading: false,
            imageUrl: '',
            rowContent: '',
            ini: false,
            quantClassroom:[],//量化课堂id
        }
    }
    componentDidMount() {
        this.bindData()
    }
    bindData() {
        let id = this.props.location.state.id;//量化课堂Id
        ServerHandle.POST({
            url: '/web/quantized/detail',
            data: { id: id }
        }).then(result => {
            if (result.success) {
                console.log(result)
                this.props.form.setFieldsValue({
                    title: result.data.title,
                    managerRealName: this.props.location.state.managerRealName ,
                    urlVideo: result.data.urlVideo,
                    introduction:result.data.introduction
                }, () => {
                    this.setState({
                        quantClassroom:id,
                        imageUrl: result.data.urlImage,
                        rowContent: result.data.introduction,
                        ini: true,
                    });
                });
            }
        })
    }
    handleSubmit() {
        //编辑量化课堂
        let title=$("#title").val();
        let urlVideo=$("#urlVideo").val()
        this.props.form.validateFields((err, values) => {
           console.log(err,values)
        });
        ServerHandle.POST({
            url:'/web/quantized/edit',
            data:{
                id:this.state.quantClassroom,
                title:title,
                urlImage:this.state.imageUrl,
                urlVideo:urlVideo,
                introduction:this.state.rowContent
            }
        }).then(result=>{
            if(result.success){
                message.success("编辑量化课堂成功");
                
                this.props.history.push('/index/quantClassroom');
            }
        })
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
    //富文本
    handleChange = (content) => {
        this.setState({ rowContent: content });
    }
    //上传图片
    handleUpload = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl: info.file.response.data,
                loading: false,
            }));
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };

        //上传图片
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        //富文本
        const editorProps = {
            height: 500,
            contentFormat: 'html',
            initialContent:  this.state.rowContent,
            onChange: this.handleChange,
        }
        return (
            <div className="AddContent">
                <Form >
                    <Form.Item
                        {...formItemLayout}
                        label="客户经理："
                    >
                        {getFieldDecorator(`managerRealName`, {})(
                            <Input disabled={true} />
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
                            <Upload
                                name="filename"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="/web/oss/ImageUpload/upload"
                                onChange={this.handleUpload}
                            >
                                {this.state.imageUrl ? <img src={this.state.imageUrl} alt="avatar" /> : uploadButton}
                            </Upload>
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
                                {
                                    this.state.ini &&
                                    <BraftEditor {...editorProps} />
                                }
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
