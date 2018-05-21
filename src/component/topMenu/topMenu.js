import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './topMenu.css';
import { Icon, } from 'antd';
import $ from 'jquery';
import { RouteEnum } from '../../enum/routeEnum';
// import { Link } from 'react-router-dom';


//顶部菜单
export default class TopMenu extends Component {
    render() {
        return (
            <div className="top-menu" >
                <div className="top-menu-sub flex-row al-center" >
                    <div className="hands">
                        <Icon  
                        type={this.props.collasped? 'menu-unfold' : 'menu-fold'}
                        // onClick={}
                        style={{ fontSize: 18 }}/>
                    </div>
                    <div className="fill-flex flex-row ju-right" >
                        <div className="top-menu-user" >当前用户：<a>管理员</a> <a>退出</a> </div>
                        <div>用户角色：超级管理员</div>
                    </div>
                </div>
                <SubMenu {...this.props} />
            </div>
        );
    }
}


class SubMenu extends Component {
    /**
     * 路由跳转
     */
    target = (url) => {
        this.props.target(url);
    }
    handClick = (key, e) => {
        const route_Menu_list = $('.route-item');
        const route_content_list = $('.main-content-item');
        let targetUrl = null;
        for (let i = 0; i < route_Menu_list.length; i++) {
            const dom = route_Menu_list[i];
            if ($(dom).attr('data-key') === key) {
                $(dom).remove();
                if ($(dom).hasClass('active')) {
                    var pre1 = route_Menu_list[i - 1];
                    targetUrl = $(pre1).attr('data-key');
                }
            }
        }
        for (let i = 0; i < route_content_list.length; i++) {
            const dom2 = route_content_list[i];
            if ($(dom2).attr('data-key') === key) {
                $(dom2).remove();
                if ($(dom2).css('display') !== 'none') {
                    var pre2 = route_content_list[i - 1];
                    $(pre2).css('display', 'block');
                }
            }
        }
        e.stopPropagation();
        targetUrl && this.target(targetUrl); 
    }
    componentDidUpdate = () => {
        const dom = this.refs.submenu;
        const dom_children = $(dom).children();
        $('.sub-menu-item').removeClass('active');
        const { path } = this.props;
        let find = false;
        for (let i = 0; i < dom_children.length; i++) {
            const element = dom_children[i];
            if ($(element).attr('data-key') === path) {
                $(element).addClass('active');
                find = true;
                break;
            }
        }
        if (!find) {
            const findRoute = RouteEnum.find(p => p.route === path);
            if (findRoute) {
                const box = document.createElement('div');
                $(box)
                    .addClass('sub-menu-item flex-row al-center active hands route-item')
                    .attr('data-key', path)
                const com = <div onClick={this.target.bind(this, findRoute.route)} >
                    {findRoute.title}
                    <span className="sub-menu-close-btn">
                        <Icon type="close"  onClick={this.handClick.bind(this, findRoute.route)} />
                    </span>
                </div>
                dom.append(box);
                ReactDOM.render(com, box);
            }
        }
    }
    render() {
        return (
            <div className="sub-menu flex-row" ref="submenu" >
                <div data-key="/" className="route-item sub-menu-item flex-row al-center active hands" >
                    <div onClick={this.target.bind(this, '/')} >
                        管理页面
                        <span className="sub-menu-close-btn"   >
                            <Icon type="close" onClick={this.closeClick} />
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}