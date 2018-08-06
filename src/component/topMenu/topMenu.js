import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './topMenu.css';
import { Icon,message,Modal } from 'antd';
import $ from 'jquery';
import { RouteEnum } from '../../enum/routeEnum';
import ServerHandle from '../../utils/ApiHandle';

//顶部菜单
export default class TopMenu extends Component {
    
    static propTypes = {
        toggleCollapsed: PropTypes.any,
        collasped: PropTypes.bool
    }
    constructor(props) {
        super(props);
        this.handClick=this.handClick.bind(this);
    }
    handClick(){
        const _this=this;
        Modal.confirm({
            title: '确定退出登录?',
            okText:'确认',
            cancelText:'取消',
            onOk() {
                ServerHandle.GET(
                    {
                        url: `/web/logout`,
                        data: {},
                    }
                ).then(result => {
                    if (result.success) {
                        message.success('退出成功');
                        _this.props.target("/");
                    }
                    else {
                        message.error(result.message);
                    }
                })  
              },
              onCancel() {},
          });
    }
    render() {
        const { collapsed, toggleCollapsed } = this.props;
        // console.log(this);
        return (
            <div className="top-menu" >
                <div className="top-menu-sub flex-row al-center" >
                    <div className="hands">
                        <Icon
                            type={collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={toggleCollapsed}
                            style={{ fontSize: 18 }} />
                    </div>
                    <div className="fill-flex flex-row ju-right" >
                        <div className="top-menu-user" >当前用户：<span style={{paddingRight:15}}>管理员</span>
                            <a onClick={this.handClick}>退出</a>
                        </div>
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
                    .click(this.target.bind(this, findRoute.route))
                const com = <div style={{ margin: '0 auto' }} >
                    {findRoute.title}
                    <span className="sub-menu-close-btn">
                        <Icon type="close" onClick={this.handClick.bind(this, findRoute.route)} />
                    </span>
                </div>
                dom.append(box);
                ReactDOM.render(com, box);
            }
        }
    }
    componentDidMount = () => {
        $(".index").trigger("click");
    }
    render() {
        return (
            <div className="sub-menu flex-row" ref="submenu" >
                <div data-key="/index" className="route-item sub-menu-item flex-row al-center active hands index" onClick={this.target.bind(this, '/index')}>
                    <div style={{ margin: '0 auto' }}  >
                       首页
                    </div>
                </div>
            </div>
        )
    }
}