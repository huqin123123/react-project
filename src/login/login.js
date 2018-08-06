import React, { Component } from 'react';
import { Button, Input, Form, message } from 'antd';
import './login.css';
import bg from './u1.jpg';
import $ from 'jquery';
import ServerHandle from '../utils/ApiHandle';
const backgroundImg = {
    backgroundSize: '100% 100%',
    backgroundImage: 'url(' + bg + ')',
}
class Login extends Component {
    constructor(props) {
        super(props);
        this.btnClick =this.btnClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    btnClick(){
        $('#btn img').attr('src','/web/loadverify?'+Math.random());
    }
    handleClick() {
        var ID = $('#login_ID').val();
        var psw = $('#login_psw').val();
        var code = $('#login_code').val();
        ServerHandle.POST(
            {
                url: `/web/doLogin`,
                data: { employeeID: ID, password: psw, msgCode: code },
            }
        ).then(result => {
            if (result.success) {
                console.log(123)
                console.log(this)
                this.props.history.push("/index");
                message.success('登录成功');
            }
            else {
                message.error(result.message);
            }
        })
    }
    render() {
        return (
            <div className="app" style={backgroundImg}>
                <div className="login">
                    <div className="login-logo"><img className="logo-img" src={require('../login/u22.png')} alt="." />AceQuant</div>
                    <div className="login-text"> 量化家，您的私人订制专家</div>
                    <div className="login-input">
                        <Input placeholder="账户" id="login_ID" />
                        <Input placeholder="密码" type="password" id="login_psw" />
                        <span className="Code">
                            <Input placeholder="验证码" className="input3" id="login_code" />
                            <Button className="btn" id="btn" onClick={this.btnClick}>
                                <img
                                    src={
                                        process.env.NODE_ENV !== "development" ?
                                            '/apis/web/loadverify?' + new Date().getTime()
                                            :
                                            '/web/loadverify?' + new Date().getTime()
                                    }
                                    alt="图片验证" className="verify_codeid" />
                            </Button>
                        </span>
                        <Button onClick={this.handleClick} className="btn2" type="primary">登录</Button>
                    </div>
                </div>
                <div className="copy">copyright@ 2017 www.acequant.cn All Rights Reseved</div>
            </div>
        );
    }
}
export default Form.create()(Login);
