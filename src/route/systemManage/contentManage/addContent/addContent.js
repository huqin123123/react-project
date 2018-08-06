import React, { Component } from 'react';
import { Button, Form, Cascader, Upload, Icon, Input, Modal } from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
const { TextArea } = Input;
const FormItem = Form.Item;
const option = [{
    value: '首页轮播',
    label: "首页轮播"
}, {
    value: '首页自选',
    label: "首页自选"
}, {
    value: '首页智能投顾',
    label: "首页智能投顾"
}, {
    value: '首页VIP服务',
    label: "首页VIP服务"
}, {
    value: '用户协议',
    label: "用户协议"
}, {
    value: '订阅协议',
    label: "订阅协议"
}, {
    value: '帮助文档',
    label: "帮助文档"
}, {
    value: '专业详解',
    label: "专业详解"
}, {
    value: '引导下载APP',
    label: "引导下载APP"
}]
// 
class AddContent extends Component {
    /**
       * 添加内容
       * handleSubmit提交
       * handleChange，handlePreview上传图片
       * normFile选择图片
       * 
       */
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [{
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
    };
    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    handleChange = ({ fileList }) => this.setState({ fileList })

    handleReset = () => {
        this.props.form.resetFields();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
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
        console.log(content)
      }
      handleRawChange = (rawContent) => {
        console.log(rawContent)
      }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        const { previewVisible, previewImage, fileList } = this.state;
        //富文本
        const editorProps = {
            height: 500,
            contentFormat: 'html',
            initialContent: '<p><p>',
            onChange: this.handleChange,
            onRawChange: this.handleRawChange
        }
       
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="AddContent">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="内容版块"
                    >
                        {getFieldDecorator('content', {
                            rules: [
                                { required: true, message: '请选择' },
                            ],
                        })(
                            <Cascader options={option} placeholder="请选择" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="内容标题"
                    >
                        {getFieldDecorator('Biaoti', {
                            rules: [
                                { required: true, message: '请输入' },
                            ],
                        })(
                            <Input placeholder="请输入" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="封面图片"
                    >
                        {getFieldDecorator('image', {
                            rules: [
                                { required: true, message: '请选择图片' },
                            ],
                            getValueFromEvent: this.normFile,
                        })(
                            <div className="clearfix">
                                <Upload
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
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 16 }}
                        label="内容详情"
                    >
                        {getFieldDecorator('details', {
                            rules: [
                                { required: true, message: '请输入' },
                            ],
                        })(
                            <BraftEditor {...editorProps} />
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ span: 8, offset: 2 }}
                    >
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>取消</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
export default Form.create()(AddContent);
