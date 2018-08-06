import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './leftMenu.css';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';


const route_map = new Map([
    ['/strategySelf', 'sub1'],
    ['/relatedStare', 'sub2'],
    ['/unrelatedStare', 'sub2'],
    ['/combinationManage', 'sub3'],
    ['/talentViewpoint', 'sub3'],
    ['/myAccount', 'sub4'],
    ['/accountFlow', 'sub4'],
    ['/userPresentation', 'sub4'],
    ['/userData', 'sub5'],
    ['/myUser', 'sub5'],
    ['/employeeManage', 'sub6'],
    ['/personalUser', 'sub6'],
    ['/mechanismUser', 'sub6'],
    ['/personalUser', 'sub7'],
    ['/roleManage', 'sub7'],
    ['/parameterSetting', 'sub7'],
    ['/contentManage', 'sub7'],
    ['/versionManagement', 'sub7'],
]);
const tab_map = new Map([
    ['sub1', ''],
    ['sub2', ''],
    ['sub3', ''],
    ['sub4', ''],
    ['sub5', ''],
    ['sub6', ''],
    ['sub7', ''],
]);
export default class LeftMenu extends Component {
    static propTypes = {
        collapsed: PropTypes.bool
    };
    /**
     * target()路由跳转
     */
    target = (url) => {
        this.props.target(url);
    }
    rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub4', "sub5", "sub6", "sub7",];
    state = {
        openKeys: [''],
        selectedKeys: [''],
    };
    onOpenChange = (openKeys) => {
        /**
         * @onOpenChange打开菜单
         * @latestOpenKey获取一级菜单
         * @spath打开菜单获取的路由
         */
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        const spath = tab_map.get(latestOpenKey);

        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
            // console.log(latestOpenKey);
        }
        if (spath !== '') {
            this.setState({ openKeys });
            spath && this.target(spath);
        }
    }
    onSelect = (selectedKeys) => {
        /**
         * 将每一次点过的二级路由地址保存，但遇到1级路由地址相同会覆盖上一次的
         * @firstMenu获取的路由地址
         * @secondMenu保存路由地址
         */
        const firstMenu = route_map.get(selectedKeys.selectedKeys[0]);
        const secondMenu = tab_map.set(firstMenu, selectedKeys.selectedKeys[0]);
    }
    handleClick = (e) => {
        e.key && this.target(e.key);
    }
    render() {
        const { collapsed } = this.props;
        return (
            <div className="left-menu" >
                <div className="left-menu-logo"><img className="logo-img" src={require('../leftMenu/logo.png')}/><span>AceQuant</span></div>
                <Menu
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={collapsed}
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                    selectedKeys={this.state.openKeys2}
                    onSelect={this.onSelect}
                >
                    <Menu.SubMenu key="sub1" title={<span> <Icon type="dashboard" />{collapsed ? "" : "策略管理"}</span>}>
                        <Menu.Item key="/index/strategySelf"><Link to="/index/strategySelf" >自营策略</Link></Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="sub2" title={<span> <Icon type="eye" />{collapsed ? "" : "盯盘管理"}</span>}>
                        <Menu.Item key="/index/relatedStare"><Link to="/index/relatedStare"> 关联盯盘</Link></Menu.Item>
                        <Menu.Item key="/index/unrelatedStare"><Link to="/index/unrelatedStare"> 非关联盯盘</Link></Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="sub3" title={<span> <Icon type="team" />{collapsed ? "" : "达人管理"}</span>}>
                        <Menu.Item key="/index/combinationManage"><Link to="/index/combinationManage"> 组合管理</Link></Menu.Item>
                        <Menu.Item key="/index/talentViewpoint"><Link to="/index/talentViewpoint"> 达人观点</Link></Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="sub4" title={<span> <Icon type="red-envelope" />{collapsed ? "" : "财务管理"}</span>}>
                        <Menu.Item key="/index/myAccount"><Link to="/index/myAccount"> 我的账户</Link></Menu.Item>
                        <Menu.Item key="/index/accountFlow"><Link to="/index/accountFlow" > 账户流水</Link></Menu.Item>
                        <Menu.Item key="/index/userPresentation"><Link to="/index/userPresentation" > 用户提现</Link></Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="sub5" title={<span> <Icon type="customer-service" />{collapsed ? "" : "统计数据"}</span>}>
                        <Menu.Item key="/index/userData"><Link to="/index/userData" > 用户数据</Link></Menu.Item>
                        <Menu.Item key="/index/myUser"><Link to="/index/myUser" > 我的用户</Link></Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="sub6" title={<span> <Icon type="user" />{collapsed ? "" : "用户管理"}</span>}>
                        <Menu.Item key="/index/employeeManage"><Link to="/index/employeeManage">员工管理</Link></Menu.Item>
                        <Menu.Item key="/index/personalUser"><Link to="/index/personalUser" > 个人用户</Link></Menu.Item>
                        <Menu.Item key="/index/mechanismUser"><Link to="/index/mechanismUser"> 机构用户</Link></Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="sub7" title={<span> <Icon type="dashboard" />{collapsed ? "" : "系统管理"}</span>}>
                        <Menu.Item key="/index/roleManage"><Link to="/index/roleManage" > 角色管理</Link></Menu.Item>
                        <Menu.Item key="/index/parameterSetting"><Link to="/index/parameterSetting" > 参数设置</Link></Menu.Item>
                        <Menu.Item key="/index/contentManage"><Link to="/index/contentManage" >内容管理</Link></Menu.Item>
                        <Menu.Item key="/index/quantClassroom"><Link to="/index/quantClassroom" >量化课堂</Link></Menu.Item>
                        <Menu.Item key="/versionManagement"><Link to="/index/versionManagement" > 版本管理</Link></Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </div >
        );
    }
}