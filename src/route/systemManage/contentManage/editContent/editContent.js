import React, { Component } from 'react';
import './editContent.css';
import {Button,Form,Upload,Icon,Input,Modal } from 'antd';
const {TextArea } =Input;
const FormItem = Form.Item;
class EditContent extends Component {
    /**
     * 上传图片
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
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
          };
          const { previewVisible, previewImage, fileList } = this.state;
          const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
        return(
            <div className="EditContent">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                    {...formItemLayout}
                    label="内容标题"
                    hasFeedback
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
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                        })(                    
                            <div className="clearfix">
                            <Upload
                            //   action="//jsonplaceholder.typicode.com/posts/"
                              listType="picture-card"
                              fileList={fileList}
                              onPreview={this.handlePreview}
                              onChange={this.handleChange}
                            >
                              {fileList.length >=1 ? null : uploadButton}
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                              <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                          </div>
                         )}
                    </FormItem>
                    <FormItem
                     labelCol={ {span: 2} }
                    wrapperCol= { { span:16}}
                    label="内容详情"
                    >
                    {getFieldDecorator('details', {
                        rules: [
                        { required: true, message: '请输入' },
                        ],
                    })(
                        <TextArea rows={20} placeholder="支持富文本" />
                    )}
                    </FormItem>
                    <FormItem
                    wrapperCol={{ span: 8, offset: 2 }}
                    >
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button style={{marginLeft:8}}>取消</Button>
                    
                    </FormItem>
                </Form>
            </div>
        );
    }
}
export default Form.create()(EditContent);