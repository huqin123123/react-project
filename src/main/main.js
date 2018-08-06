import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import LeftMenu from '../component/leftMenu/leftMenu';
import TopMenu from '../component/topMenu/topMenu';
import $ from 'jquery';
import { RouteEnum } from '../enum/routeEnum';
import Emit from '../utils/Emit';
export default class Main extends Component {
    state = {
        collasped: false,
    };
    componentDidMount() {
        console.log(this)
        Emit.on("target", (route, params) => this.props.history.push(route, params));
    }
    //获取content组件
    componentDidUpdate = () => {
        const dom = this.refs["main-content"];
        const childrenList = $(dom).children();
        $('.main-content-item').hide();
        const path = this.props.history.location.pathname;
        for (let i = 0; i < childrenList.length; i++) {
            const item = childrenList[i];
            if ($(item).attr('data-key') === path) {
                $(item).show();
                return true;
            }
        }
        const findItem = RouteEnum.find(p => p.route === path);
        // console.log(findItem)
        if (findItem) {
            const box = document.createElement('div');
            $(box)
                .addClass('main-content-item')
                .attr('data-key', path);
            dom.appendChild(box);
            ReactDOM.render(findItem.component, box);
            // console.log(box)
        }
    }
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        if (this.state.collapsed) {
            $('.left-menu').width(110).css('overflow-y', 'unset');
            $('.main-content,.top-menu').css('padding-left', '110px');
            $('.left-menu-logo span').hide();
        } else {
            $('.left-menu').width(220);
            $('.main-content,.top-menu').css('padding-left', '220px');
            $('.left-menu-logo span').show();
        }
        // console.log(this.props.history)
        return (
            <div className="main" >
                <TopMenu
                    toggleCollapsed={this.toggleCollapsed}
                    collapsed={this.state.collapsed}
                    target={this.props.history.push}
                    path={this.props.history.location.pathname} />
                <LeftMenu collapsed={this.state.collapsed} history={this.props.history} target={this.props.history.push} />
                <div className="main-content" ref="main-content" onChange={this.onEdit} >
                </div>
            </div>
        );
    }
}