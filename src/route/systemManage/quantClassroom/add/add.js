import React, { Component } from 'react';
import { Button, Form, Upload, Icon, Input, Modal, message, Select, Card } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import $ from 'jquery';
import ServerHandle from '../../../../utils/ApiHandle';
import Emit from '../../../../utils/Emit';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
class Add extends Component {
    /**
     * 上传图片
     */
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleReset = this.handleReset.bind(this);//取消按钮
        this.handlePreservation = this.handlePreservation.bind(this)
        this.handleUpload = this.handleUpload.bind(this)
        this.state = {
            loading: false,
            imageUrl: '',
            rowContent: '',
            dataList: [],//获取的客户经理数据
            value: '',//客户经理realName
            manaegerID: [],

        }
    }
    componentDidMount() {
        console.log(this);
        Emit.emit("target");
        ServerHandle.GET({
            url: '/web/manager/listAll',
            data: {}
        }).then(result => {
            if (result.success) {
                console.log(result)
                this.setState({ dataList: result.data })
            }
            else {
                message.error(result.message);
            }
        })
    }
    handleReset() {
        console.log(this)
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
    handlePreservation() {
        this.props.form.validateFields((err, values) => {
            let title = $('#title').val();
            let urlVideo = $('#urlVideo').val();
            let introduction = $("#introduction").val();
            console.log(introduction)
            ServerHandle.POST(
                {
                    url: `/web/quantized/add`,
                    data: {
                        managerId: this.state.manaegerID,
                        title: encodeURI(title),
                        urlImage: encodeURI(this.state.imageUrl),
                        urlVideo: encodeURI(urlVideo),
                        introduction: encodeURI(this.state.rowContent),
                    }
                }).then(result => {
                    if (result.success) {
                        message.success('保存成功');
                        this.props.history.push('/index/quantClassroom')
                    } else {
                        message.error(result.message);
                    }
                })
        });
    }
    //富文本
    handleChange = (content) => {
        console.log(content)
        this.setState({ rowContent: content }, () => { console.log(this.state.rowContent) });
    }
    /**
         * 上传图片
         */
    handleUpload = (info) => {
        console.log(info.file.response);
        if (info.file.status === 'uploading') {
            this.setState({ loading: true, });
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl: info.file.response.data,
                loading: false,
            }, () => { console.log(this.state.imageUrl) }));
        }

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { dataList } = this.state;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        //图片上传
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        //富文本
        const editorProps = {
            height: 500,
            contentFormat: 'html',
            initialContent: '<p></p>',
            onChange: this.handleChange,
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
                                <BraftEditor {...editorProps} />
                            </Card>
                        )}
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ span: 8, offset: 2 }}
                    >
                        <Button type="primary" htmlType="submit" onClick={this.handlePreservation}>保存</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>取消</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
export default Form.create()(Add);
