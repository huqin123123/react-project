import React, { Component } from 'react';
import './leftMenu.css';
import { Menu,Icon } from 'antd';
import { Link } from 'react-router-dom';


//左面菜单
export default class LeftMenu extends Component {
    state={
        collasped:false,
    }
    toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      }
    render() {
        return (    
            <div className="left-menu" >
                <Menu 
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.props.collasped}
                >
                    <Menu.SubMenu  title={<span> <Icon type="user"  />用户管理</span>}>
                        <Menu.Item><Link to="/employeeList" key="1"> 员工列表</Link></Menu.Item>
                        <Menu.Item><Link to="/personalUser"> 个人用户</Link></Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu title={<span> <Icon type="dashboard" />策略管理</span>}>
                        <Menu.Item><Link to="/strategySelf">自营策略</Link></Menu.Item>
                       
                    </Menu.SubMenu>
                    <Menu.SubMenu title={<span> <Icon type="customer-service" />投顾管理</span>}>
                        <Menu.Item><Link to="/customerList"> 投顾列表</Link></Menu.Item>
                        <Menu.Item><Link to="/customerViewpoint"> 投顾观点</Link></Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu title={<span> <Icon type="eye" />智能盯盘</span>}>
                        <Menu.Item><Link to="/relatedStare"> 关联盯盘</Link></Menu.Item>
                        <Menu.Item><Link to="/unrelatedStare"> 非关联盯盘</Link></Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu title={<span> <Icon type="dashboard" />系统管理</span>}>
                        <Menu.Item><Link to="/parameterSetting"> 参数设置</Link></Menu.Item>
                        <Menu.SubMenu title={<Link to="/contentManage" style={{color:'#fff'}}>内容管理</Link>}>
                            <Menu.Item><Link to="/addContent"> 添加内容</Link></Menu.Item>
                            <Menu.Item><Link to="/editContent"> 编辑内容</Link></Menu.Item>
                        </Menu.SubMenu>
                        <Menu.Item><Link to="/versionManagement"> 版本管理</Link></Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </div >
        );
    }
}