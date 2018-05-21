import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import LeftMenu from '../component/leftMenu/leftMenu';
import TopMenu from '../component/topMenu/topMenu';
import $ from 'jquery';
import { RouteEnum } from '../enum/routeEnum';


export default class Main extends Component {
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
        if (findItem) {
            const box = document.createElement('div');
            $(box)
                .addClass('main-content-item')
                .attr('data-key', path);
            dom.appendChild(box);
            ReactDOM.render(findItem.component, box);
        }

    }
    render() {
        return (
            <div className="main" >
                <TopMenu target={this.props.history.push} path={this.props.history.location.pathname} />
                <LeftMenu />
                <div className="main-content" ref="main-content"  onChange={this.onEdit} >
                    <div className="main-content-item" data-key="/userManage"  >
                        {/* <StaffManage /> */}
                    </div>
                </div>
            </div>
        );
    }
}