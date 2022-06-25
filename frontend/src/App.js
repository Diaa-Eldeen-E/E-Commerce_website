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
import Page404 from "./components/Page404";
import AdminLayout from "./layouts/AdminLayout";
import RequireAuth from "./components/auth/RequireAuth";
import AdminCategories from "./components/admin/AdminCategories";
import UpdateCategory from "./components/admin/UpdateCategory";
import AdminCategory from "./components/admin/AdminCategory";
import AddProduct from "./components/admin/AddProduct";
import AdminProduct from "./components/admin/AdminProduct";
import Category from "./components/Category";
import Product from "./components/Product";
import Categories from "./components/Categories"

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

const getToken = () => localStorage.getItem('auth_token');

const Roles = {
    user: 0,
    admin: 1
}

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
                            <Route path='category/:catName' element={<Category/>}/>
                            <Route path='category/:catName/:productID' element={<Product/>}/>
                            <Route path='categories' element={<Categories/>}/>
                            <Route path='/home' element={<Home/>}/>
                            <Route path='/login' element={getToken() ? <Navigate to='/' replace/> : <Login/>}/>
                            <Route path='/register' element={getToken() ? <Navigate to='/' replace/> : <Register/>}/>

                            {/*  TODO: Add routes for categories, products, orders, cart, list, Settings  */}

                        </Route>

                        {/*Admin routes*/}
                        <Route path='/admin' element={<RequireAuth allowedRole={Roles.admin}/>}>

                            <Route element={<AdminLayout/>}>
                                <Route index element={<AdminHome/>}/>
                                <Route path='/admin/home' exact element={<AdminHome/>}/>
                                <Route path='/admin/categories' exact element={<AdminCategories/>}/>
                                <Route path='updatecategory/:catName' element={<UpdateCategory/>}/>
                                <Route path='category/:catName' element={<AdminCategory/>}/>
                                <Route path='addproduct' element={<AddProduct/>}/>
                                <Route path='category/:catName/:productID' element={<AdminProduct/>}/>

                            </Route>

                            {/*<Route index element={<AdminPrivateRoute> <AdminLayout/> </AdminPrivateRoute>}/>*/}
                        </Route>


                        <Route path='/notfound' element={<Page404/>}/>
                        <Route path='*' element={<Page404/>}/>

                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </div>

    );
}

export default App;
