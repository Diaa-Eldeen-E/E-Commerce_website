import React from 'react';
import Layout from './layouts/Layout';
import Home from './pages/Home'
import AdminPrivateRoute from "./routes/AdminPrivateRoute";
import AuthProvider, {useAuth} from "./auth/AuthProvider";
import Login from "./auth/Login";
import Register from "./auth/Register";

import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, BrowserRouter, Routes} from "react-router-dom";
import AdminHome from "./admin/AdminHome";
import {useNavigate, Navigate} from "react-router";

import axios from "axios";
import Page404 from "./pages/Page404";
import AdminLayout from "./layouts/AdminLayout";
import RequireAuth from "./auth/RequireAuth";
import AdminCategories from "./admin/AdminCategories";
import UpdateCategory from "./admin/UpdateCategory";
import AddCategory from "./admin/AddCategory";
import AdminCategory from "./admin/AdminCategory";
import AddProduct from "./admin/AddProduct";
import AdminProduct from "./admin/AdminProduct";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import CategoriesPage from "./pages/CategoriesPage"
import SearchPage from "./pages/SearchPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import UpdateProduct from "./admin/UpdateProduct";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

const getToken = () => localStorage.getItem('auth_token');

const Roles = {
    user: 0,
    admin: 1
}

// Handle axios error responses
// https://stackoverflow.com/questions/48990632/how-to-manage-axios-errors-globally-or-from-one-point
// https://medium.com/@ejjay/a-short-ajax-story-on-error-handlers-8baeeccbc062

// errorComposer will compose a handleGlobally function
const errorComposer = (error) => {
    return () => {
        const statusCode = error.response ? error.response.status : null;

        if (statusCode === 404)
            window.location.href = '/notfound';

        // Not authenticated, login to access this resource
        if (statusCode === 401)
            window.location.href = '/login';

        // Forbidden
        if (statusCode === 403)
            window.location.href = '/forbidden';
    }
}

axios.interceptors.response.use(undefined, function (error) {
    
    const statusCode = error.response ? error.response.status : null;

    if (statusCode === 404)
        window.location.href = '/notfound';

    if (statusCode === 401)
        window.location.href = '/login';

    if (statusCode === 403)
        window.location.href = '/forbidden';

    throw error;

    // error.handleGlobally = errorComposer(error);
    // return Promise.reject(error);
})

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
                            <Route path='category/:categoryID' element={<ProductsPage/>}/>
                            <Route path='product/:productID' element={<ProductPage/>}/>
                            <Route path='categories' element={<CategoriesPage/>}/>
                            <Route path='/home' element={<Home/>}/>
                            <Route path='/login' element={getToken() ? <Navigate to='/' replace/> : <Login/>}/>
                            <Route path='/register' element={getToken() ? <Navigate to='/' replace/> : <Register/>}/>

                            <Route path='search' element={<SearchPage/>}/>
                            <Route path='wishlist' element={<WishlistPage/>}/>
                            <Route path='cart' element={<CartPage/>}/>
                            {/*  TODO: Add routes for orders, Settings  */}

                        </Route>

                        {/*Admin routes*/}
                        <Route path='/admin' element={<RequireAuth allowedRole={Roles.admin}/>}>

                            <Route element={<AdminLayout/>}>
                                <Route index element={<AdminHome/>}/>
                                <Route path='/admin/home' exact element={<AdminHome/>}/>
                                <Route path='/admin/categories' exact element={<AdminCategories/>}/>
                                <Route path='updatecategory/:categoryID' element={<UpdateCategory/>}/>
                                <Route path='addcategory' element={<AddCategory/>}/>
                                <Route path='category/:categoryID' element={<AdminCategory/>}/>
                                <Route path='addproduct' element={<AddProduct/>}/>
                                <Route path='updateproduct/:productID' element={<UpdateProduct/>}/>
                                <Route path='product/:productID' element={<AdminProduct/>}/>
                                <Route path='search' element={<SearchPage isAdmin={true}/>}/>

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
