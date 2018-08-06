import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Main from './main/main';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './login/login';


ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/" component={Login} exact={true} />
            <Route path="/index" component={Main} />
        </Switch>
    </Router>, document.getElementById('root'));
registerServiceWorker();
