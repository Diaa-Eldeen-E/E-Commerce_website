
import Layout from '../layouts/Layout';

import Login from "../features/auth/Login";
import Register from "../features/auth/Register";

import { Route, BrowserRouter, Routes } from "react-router-dom";
import Dashboard from "../admin/Dashboard";
import { Navigate } from "react-router";

import Page404 from "../app/Page404";

import UpdateCategory from "../admin/UpdateCategory";
import AddCategory from "../admin/AddCategory";
import AdminCategory from "../admin/AdminCategory";
import AddProduct from "../admin/AddProduct";
import AdminProduct from "../admin/AdminProduct";
import ProductsPage from "../features/products/ProductsPage";
import ProductPage from "../features/products/ProductPage";
import CategoriesPage from "../features/categories/CategoriesPage"
import SearchPage from "../features/search/SearchPage";
import WishlistPage from "../features/wishlist/WishlistPage";
import CartPage from "../features/cart/CartPage";
import UpdateProduct from "../admin/UpdateProduct";
import OrdersPage from "../features/orders/OrdersPage";

import { useSelector } from "react-redux";
import ProtectedRoute from './ProtectedRoute';
import CheckoutSuccessPage from '../features/cart/CheckoutSuccessPage';
import OrderPage from '../features/orders/OrderPage';


const Roles = {
    user: 0,
    admin: 1
}


const AppRouter = () =>
{
    const { userToken, userInfo } = useSelector((state) => state.auth)
    const isAdmin = userInfo?.isAdmin ? 1 : 0

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout isAdmin={isAdmin} />}>

                        <Route index element={<CategoriesPage isAdmin={isAdmin} />} />
                        <Route path='product-category/:categoryID' element={<ProductsPage />} />
                        <Route path='product-category/:categoryID/:categoryName' element={<ProductsPage />} />
                        <Route path='product/:productID' element={<ProductPage />} />
                        <Route path='product/:productID/:productSlug' element={<ProductPage />} />
                        <Route path='categories' element={<CategoriesPage isAdmin={isAdmin} />} />

                        <Route path='/login' element={userToken ? <Navigate to='/' replace /> : <Login />} />
                        <Route path='/register' element={userToken ? <Navigate to='/' replace /> : <Register />} />

                        <Route path='search' element={<SearchPage isAdmin={isAdmin} />} />

                        {/* User protected routes */}
                        <Route element={<ProtectedRoute isAllowed={userInfo ? 1 : 0} redirectPath={'/login'} />}>
                            <Route path='cart' element={<CartPage />} />
                            <Route path='wishlist' element={<WishlistPage />} />
                            <Route path='orders' element={<OrdersPage />} />
                            <Route path='order/:orderID' element={<OrderPage />} />
                            <Route path='checkout-success' element={<CheckoutSuccessPage />} />
                        </Route>


                        {/* Admin protected routes */}
                        {/* <ProtectedRoute><Route path='addcategory' element={<AddCategory />} /></ProtectedRoute> */}
                        <Route element={<ProtectedRoute isAllowed={userInfo?.isAdmin ? 1 : 0} />}>
                            <Route path='addcategory' element={<AddCategory />} />
                        </Route>
                        <Route element={<ProtectedRoute isAllowed={userInfo?.isAdmin ? 1 : 0} />}>
                            <Route path='/admin/home' exact element={<Dashboard />} />
                            <Route path='updatecategory/:categoryID' element={<UpdateCategory />} />
                            {/* <Route path='addcategory' element={<AddCategory />} /> */}
                            <Route path='/admin/product-category/:categoryID' element={<AdminCategory />} />
                            <Route path='/admin/product-category/:categoryID/:categoryName' element={<AdminCategory />} />
                            <Route path='addproduct' element={<AddProduct />} />
                            <Route path='updateproduct/:productID' element={<UpdateProduct />} />
                            <Route path='/admin/product/:productID' element={<AdminProduct />} />
                        </Route>
                    </Route>

                    <Route path='/notfound' element={<Page404 />} />
                    <Route path='*' element={<Page404 />} />

                </Routes>

            </BrowserRouter>
        </div >
    )
}

export default AppRouter