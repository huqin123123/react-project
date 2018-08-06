import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AddContent from '../addContent/addContent';
import EditContnent from '../editContent/editContent';
import ContManage from '../Manage/Manage';

export default class ContentManage extends Component {
    render() {
        return (
            <div>
                <Router >
                    <Switch>
                        <Route path="/index/contentManage" exact component={ContManage} />
                        <Route path="/index/contentManage/addContent" exact component={AddContent} />
                        <Route path="/index/contentManage/editContent" exact  component={EditContnent}/>
                    </Switch>
                </Router>
            </div>
        )
    }
}
