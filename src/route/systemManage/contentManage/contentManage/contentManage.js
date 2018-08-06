import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AddContent from '../addContent/addContent';
import EditContnent from '../editContent/editContent'
import Manage from '../Manage/Manage'

export default class ContentManage extends Component {
    render() {
        return (
            <div>
                <Router >
                    <Switch>
                        <Route path="/index/contentManage" exact component={Manage} />
                        <Route path="/index/contentManage/addContent" component={AddContent} />
                        <Route path="/index/contentManage/editContent"  component={EditContnent}/>
                    </Switch>
                </Router>
            </div>
        )
    }
}
