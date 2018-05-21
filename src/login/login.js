import React, { Component } from 'react';
import { Button, Input, Form, } from 'antd';
import './login.css';
class Login extends Component {
    render() {
        return (
            <div>
                <Form>
                    <Form.Item>
                        <Input placeholder="账户" />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="密码" />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="验证码" />
                        <Input type="button"> AFGD</Input>
                    </Form.Item>
                    <Form.Item>
                        <Button >登录</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

}
