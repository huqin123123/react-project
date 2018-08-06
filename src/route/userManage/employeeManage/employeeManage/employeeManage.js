import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AccountFlow from '../accountFlow/accountFlow';
import Manage from '../Manage/Manage';

export default class ContentManage extends Component {
    render() {
        return (
            <div>
                <Router >
                    <Switch>
                        <Route path="/index/employeeManage" exact component={Manage} />
                        <Route path="/index/employeeManage/accountFlow"  component={AccountFlow} />
                    </Switch>
                </Router>
            </div>
        )
    }
}
