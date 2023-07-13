
import Layout from '../layouts/Layout';
import Home from '../pages/Home'

import Login from "../auth/Login";
import Register from "../auth/Register";

import { Route, BrowserRouter, Routes } from "react-router-dom";
import AdminHome from "../admin/AdminHome";
import { Navigate } from "react-router";

import Page404 from "../pages/Page404";
import AdminLayout from "../layouts/AdminLayout";
import RequireAuth from "../auth/RequireAuth";
import AdminCategories from "../admin/AdminCategories";
import UpdateCategory from "../admin/UpdateCategory";
import AddCategory from "../admin/AddCategory";
import AdminCategory from "../admin/AdminCategory";
import AddProduct from "../admin/AddProduct";
import AdminProduct from "../admin/AdminProduct";
import ProductsPage from "../pages/ProductsPage";
import ProductPage from "../pages/ProductPage";
import CategoriesPage from "../pages/CategoriesPage"
import SearchPage from "../pages/SearchPage";
import WishlistPage from "../pages/WishlistPage";
import CartPage from "../pages/CartPage";
import UpdateProduct from "../admin/UpdateProduct";

import { useSelector } from "react-redux";


const Roles = {
    user: 0,
    admin: 1
}


const AppRouter = () =>
{
    const { userToken } = useSelector((state) => state.auth)

    return (
        <div>
            <BrowserRouter>
                {/*Change from Switch to Routes*/}
                <Routes>
                    {/*Change from component to element and change from Home to <Home/>*/}
                    <Route path='/' element={<Layout />}>

                        {/*Index route A child route with no path that renders in the parent's outlet at
                             the parent's URL By default*/}
                        <Route index element={<Home />} />
                        <Route path='category/:categoryID' element={<ProductsPage />} />
                        <Route path='product/:productID' element={<ProductPage />} />
                        <Route path='categories' element={<CategoriesPage />} />
                        <Route path='/home' element={<Home />} />
                        {/* <Route path='/login' element={<Login />} /> */}
                        <Route path='/login' element={userToken ? <Navigate to='/' replace /> : <Login />} />
                        <Route path='/register' element={userToken ? <Navigate to='/' replace /> : <Register />} />

                        <Route path='search' element={<SearchPage />} />
                        <Route path='wishlist' element={<WishlistPage />} />
                        <Route path='cart' element={<CartPage />} />
                        {/*  TODO: Add routes for orders, Settings  */}

                    </Route>


                    {/*Admin routes*/}
                    <Route path='/admin' element={<RequireAuth allowedRole={Roles.admin} />}>

                        <Route element={<AdminLayout />}>
                            <Route index element={<AdminHome />} />
                            <Route path='/admin/home' exact element={<AdminHome />} />
                            <Route path='/admin/categories' exact element={<AdminCategories />} />
                            <Route path='updatecategory/:categoryID' element={<UpdateCategory />} />
                            <Route path='addcategory' element={<AddCategory />} />
                            <Route path='category/:categoryID' element={<AdminCategory />} />
                            <Route path='addproduct' element={<AddProduct />} />
                            <Route path='updateproduct/:productID' element={<UpdateProduct />} />
                            <Route path='product/:productID' element={<AdminProduct />} />
                            <Route path='search' element={<SearchPage isAdmin={true} />} />

                        </Route>

                        {/*<Route index element={<AdminPrivateRoute> <AdminLayout/> </AdminPrivateRoute>}/>*/}
                    </Route>


                    <Route path='/notfound' element={<Page404 />} />
                    <Route path='*' element={<Page404 />} />

                </Routes>

            </BrowserRouter>
        </div>
    )
}

export default AppRouter