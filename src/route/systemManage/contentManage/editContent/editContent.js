import React, { Component } from 'react';
import { Button, Form, Upload, Icon, Input, message,Modal } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import $ from 'jquery';
import ServerHandle from '../../../../utils/ApiHandle';
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
class EditContent extends Component {
  constructor(props){
    super(props);
    this.contentDetails=this.contentDetails.bind(this);
    this.handleQuery=this.handleQuery.bind(this);
    this.state={
      loading:false,
      imageUrl:'',
      contentId:0,//内容id
      type:'',//内容类型
      rowContent:'',//富文本
    }
  }
  componentDidMount(){
    this.contentDetails()
  }
  contentDetails(){
    console.log(this.props.location.state)
    this.setState({
      contentId:this.props.location.state.id,},()=>{
      ServerHandle.GET({
        url:'/web/system/content/editId',
        data:{id:this.state.contentId}
      }).then(result=>{
        if(result.success){
          console.log(result)
          this.props.form.setFieldsValue({
            Biaoti:result.data.title,
          }, this.setState({
            imageUrl:result.data.image,
            type:result.data.type,
            rowContent:result.details,
          }))
        }
      })
    });
  }
  handleQuery(){
    this.props.form.validateFields((err, values) => {
      let title=$("#Biaoti").val();
      // let image=$(".AddContent .ant-upload img")[0].src;
      ServerHandle.POST({
        url:'/web/system/content/edit',
        data:{
          type:this.state.type,
          title:title,
          image:this.state.imageUrl,
          details:this.setState.rowContent,
          id:this.state.contentId,
        }
      }).then(result=>{
        if(result.success){
          message.success("编辑成功");
          this.props.history.push('/index/contentManage');
        }else{
          message.error("编辑失败")
        }
      });
    })
  }
  handleReset = () => {
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
   //富文本
   handleChange = (content) => {
    this.setState({ rowContent: content });
  }
  //上传图片
  handleUpload=(info)=>{
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl:info.file.response.data,
        loading: false,
      }));
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
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
      initialContent: this.props.location.state.details,
      onChange: this.handleChange,
    }
    return (
      <div className="EditContent">
        <Form >
          <Form.Item
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
          </Form.Item>
          <Form.Item
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
          </Form.Item>
          <Form.Item
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
          </Form.Item>
          <Form.Item
            wrapperCol={{ span: 8, offset: 2 }}
          >
            <Button type="primary" htmlType="submit" onClick={this.handleQuery}>保存</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>取消</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Form.create()(EditContent);
