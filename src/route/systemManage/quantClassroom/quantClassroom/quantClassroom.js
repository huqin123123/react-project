import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Manage from '../Manage/Manage';
import Edit from '../edit/edit';
import Add from '../add/add';
export default class ContentManage extends Component {
    render() {
        return (
            <div>
                <Router >
                    <Switch>
                        <Route path="/index/quantClassroom" exact component={Manage} />
                        <Route path="/index/quantClassroom/add" exact component={Add} />                        
                        <Route path="/index/quantClassroom/edit" exact component={Edit} />
                    </Switch>
                </Router>
            </div>
        )
    }
}
