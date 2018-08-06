import React, { Component } from 'react';
import { Button, Form, Upload, Icon, Input, Modal, message, Select, Card } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import $ from 'jquery';
import ServerHandle from '../../../../utils/ApiHandle';
import Emit from '../../../../utils/Emit';

class Add extends Component {
    /**
     * 上传图片
     */
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleReset = this.handleReset.bind(this);//取消按钮
        this.handleSubmit = this.handleSubmit.bind(this)//表单提交
        this.handleRawChange = this.handleRawChange.bind(this)//富文本
        this.imgUpload=this.imgUpload.bind(this)//上传图片
        this.handleUpload=this.handleUpload.bind(this)
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [{
                uid: -1,
                name: '',
                status: 'done',
                response: '',
                url: 'https://aq-images.oss-cn-shenzhen.aliyuncs.com/quantized/20180718/20180718160337296532251.gif',
            }],
            rowContent: '',
            dataList: [],//获取的客户经理数据
            value: '',//客户经理realName
            key: '',//客户经理id
            manaegerID: [],

        }
    }
    imgUpload(){

    }
    componentDidMount() {
        console.log(this);
        console.log(this.state.fileList[0].url)
        Emit.emit("target");
        ServerHandle.GET({
            url: '/web/manager/listAll',
            data: {}
        }).then(result => {
            if (result.success) {
                this.setState({ dataList: result.data })
            }
            else {
                message.error(result.message);
            }
        })
    }
    handleReset() {
        console.log(2)
        const _this = this;
        this.props.form.resetFields();
        Modal.confirm({
            title: '确定取消添加课堂？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                _this.props.history.push("/index/quantClassroom");
            },
            onCancel() { },
        })
    }
    handleCancel() {
        this.setState({ previewVisible: false })
    }
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    handleUpload = ({ fileList }) => {
        //上传图片
        console.log(fileList)
        this.setState({ fileList });
    }
    handleSubmit(e) {
        console.log(1)
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          console.log('Received values of form: ', values);
        });
        var title = $('#title').val();
        var urlVideo = $('#urlVideo').val();
        ServerHandle.POST(
            {
                url: `/web/quantized/add`,
                data: {
                    managerId: this.state.manaegerID,
                    title: title,
                    urlImage: this.state.fileList[0].url,
                    urlVideo: urlVideo,
                    introduction: this.state.rowContent,
                }
            }).then(result => {
                if (result.success) {
                    message.success('保存成功');
                    this.props.history.push('/index/quantClassroom')
                }else {
                    message.error(result.message);
                }
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
    handleRawChange(rawContent) {
        console.log(rawContent);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        const { previewVisible, previewImage, fileList, dataList } = this.state;
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
        };

        const children = [];
        const Option = Select.Option;
        dataList.forEach((item, index) => {
            children.push(<Option key={index} value={item.id.toString()}>{item.realName}</Option>);
            return false;
        })
        return (
            <div className="AddContent">
                <Form >
                    <Form.Item
                        {...formItemLayout}
                        label="客户经理："
                    >
                        <Select
                        //未找到客户经理，客户经理为空
                            onBlur={() => {
                                if (!this.state.manaegerID) {
                                    this.setState({
                                        value: ""
                                    })
                                }
                            }}
                            allowClear={true}
                            onChange={(e) => {
                                console.log(e)
                                let find = false;
                                this.state.dataList.forEach((item, key) => {
                                    //如果找到对应的客户经理ID
                                    if (e === item.id.toString()) {
                                        find = true;
                                        this.setState({
                                            value: item.realName,
                                            manaegerID: e
                                        })
                                    }
                                })
                                !find && this.setState({
                                    value: e,
                                    manaegerID: null,
                                })
                            }}
                            value={this.state.value}
                            mode={'combobox'}
                            style={{ width: '100%' }}
                            placeholder="请选择"
                            showArrow={true}
                            showSearch={true}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {children}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="课堂标题"
                    >
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入' }],
                        })(
                            <Input placeholder="请输入" id="title" />
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
                                    // action={this.imgUpload}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}//点击文件链接或图标预览
                                    onChange={this.handleUpload}//上传文件
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
export default Form.create()(Add);
