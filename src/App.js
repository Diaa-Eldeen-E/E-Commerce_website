import React from 'react';
import Layout from './layouts/Layout';
import Home from './components/Home'
import AdminPrivateRoute from "./routes/AdminPrivateRoute";
import AuthProvider, {useAuth} from "./components/auth/AuthProvider";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, BrowserRouter, Routes} from "react-router-dom";
import AdminHome from "./components/admin/AdminHome";
import {useNavigate, Navigate} from "react-router";

import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

const getToken = () => localStorage.getItem('auth_token');

function App() {

    return (

        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    {/*Change from Switch to Routes*/}
                    <Routes>
                        {/*Change from component to element and change from Home to <Home/>*/}
                        <Route path='/' element={<Layout/>}>

                            {/*Index route A child route with no path that renders in the parent's outlet at
                             the parent's URL By default*/}
                            <Route index element={<Home/>}/>
                            <Route path='/home' element={<Home/>}/>
                            <Route path='/login' element={getToken() ? <Navigate to='/' replace/> : <Login/>}/>
                            <Route path='/register' element={getToken() ? <Navigate to='/' replace/> : <Register/>}/>
                        </Route>
                        {/*</Routes>*/}

                        {/*Admin routes*/}
                        {/*<Routes>*/}
                        <Route
                            path='/admin/home'
                            exact
                            element={
                                <AdminPrivateRoute>
                                    <AdminHome/>
                                </AdminPrivateRoute>
                            }
                        />


                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </div>

    );
}

export default App;
