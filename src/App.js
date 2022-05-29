import React from 'react';
import Layout from './layouts/Layout';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Router, Switch} from "react-router-dom";

// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path='/' component={}
                </Switch>
            </Router>
            <Layout/>
        </div>
    );
}

export default App;
