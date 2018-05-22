import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Main from './main/main';
// import App from './login/login'; 
import { BrowserRouter as Router, Route } from 'react-router-dom';


ReactDOM.render(<Router>
    <div>
        <Route path="/" component={Main} />
    </div>
</Router>, document.getElementById('root'));
registerServiceWorker();
