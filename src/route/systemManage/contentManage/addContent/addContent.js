import React, { Component } from 'react';
import { Button, Form, Cascader, Upload, Icon, Input, message,Modal } from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import ServerHandle from '../../../../utils/ApiHandle';
import $ from 'jquery';
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
const FormItem = Form.Item;
const option = [{
    value: '1',
    label: "首页轮播"
}, {
    value: '2',
    label: "首页自选"
}, {
    value: '3',
    label: "首页智能投顾"
}, {
    value: '4',
    label: "首页VIP服务"
}, {
    value: '5',
    label: "用户协议"
}, {
    value: '6',
    label: "订阅协议"
}, {
    value: '7',
    label: "帮助文档"
}, {
    value: '8',
    label: "专业详解"
}, {
    value: '9',
    label: "引导下载APP"
}, {
    value: '10',
    label: '引导关注量化家'
}]
class AddContent extends Component {
    constructor(props) {
        super(props);
        this.handlePreservation = this.handlePreservation.bind(this);
        this.checkChange = this.checkChange.bind(this);
        this.handleUpload=this.handleUpload.bind(this);
        this.handleReset=this.handleReset.bind(this);
        this.state = {
            loading: false,
            imageUrl: '',
            type: '',//内容类型
            rowContent: '',//富文本
        }
    }
    /**
     * 内容版块验证
     */
    checkChange(value) {
        this.setState({ type: value }, () => {
            console.log(this.state.type)
            ServerHandle.GET({
                url: '/web/system/content/type',
                data: { type: this.state.type }
            }).then(result => {
                if (result.success) {
                    console.log(result)
                } else {
                    console.log(result)
                }
            })
        });
    }
    /**
     * 保存
     */
    handlePreservation() {
        console.log(this)
        this.props.form.validateFields((err, values) => {
            let title = $("#Biaoti").val();
            ServerHandle.POST({
                url: '/web/system/content/add',
                data: {
                    type: this.state.type,
                    title: title,
                    image: this.state.imageUrl,
                    details: this.state.rowContent,
                }
            }).then(result => {
                if (result.success) {
                    message.success("添加内容信息成功");
                    this.props.history.push('/index/contentManage');
                } else {
                    message.error("添加内容信息失败");
                }
            })
        });
    }
    /**
     *富文本
     */
    handleChange = (content) => {
        this.setState({ rowContent: content })
    }
    /**
     * 上传图片
     */
    handleUpload = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true,});
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl:info.file.response.data,
                loading: false,
            }));
        }
       
    }
    /**
     * 取消添加内容
     */
    handleReset(){
        const _this=this;
        Modal.confirm({
            title: '确定取消添加内容？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                _this.props.history.push('/index/contentManage');
            },
            onCancel() { },
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        //富文本
        const editorProps = {
            height: 500,
            contentFormat: 'html',
            initialContent: '',
            onChange: this.handleChange,
        }
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        return (
            <div className="AddContent">
                <Form >
                    <FormItem
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 8 }}
                        label="内容版块"
                    >
                        {getFieldDecorator('content', {
                            rules: [
                                { required: true, message: '请选择' },
                            ],
                        })(
                            <Cascader options={option} placeholder="请选择" onChange={this.checkChange} />
                        )}
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 8 }}
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
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 16 }}
                        label="封面图片"
                    >
                        {getFieldDecorator('image', {
                            rules: [
                                { required: true, message: '请选择图片' },
                            ]
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
                        <Button type="primary" htmlType="submit" onClick={this.handlePreservation}>保存</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>取消</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
export default Form.create()(AddContent);
