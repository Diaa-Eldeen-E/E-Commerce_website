import React from 'react';
import Layout from './layouts/Layout';
import Home from './components/Home'

import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, BrowserRouter, Routes} from "react-router-dom";
import AdminHome from "./components/admin/AdminHome";


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                {/*Change from Switch to Routes*/}
                <Routes>
                    {/*Change from component to element and change from Home to <Home/>*/}
                    <Route exact path='/' element={<Home/>}/>
                    <Route path='/home' element={<Home/>}/>

                </Routes>

                {/*Admin routes*/}
                <Routes>
                    <Route exact path='/admin/' element={<AdminHome/>}/>
                    <Route exact path='/admin/home' element={<AdminHome/>}/>

                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
