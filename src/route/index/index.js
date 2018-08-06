import React, { Component } from 'react';
import './index.css'
import Emit from '../../utils/Emit';

export default class Index extends Component {
    componentDidMount() {
        Emit.on("target", () => console.log(12));
    }
    render() {
        return (
            <div className="welcome">
                <div className="welcome-text">
                    欢迎使用AQ智能管理系统
                </div>
            </div>
        )
    }
}