import {Navigate, Route, useLocation} from "react-router-dom";
import AdminHome from "../components/admin/AdminHome";
import React, {useContext} from "react";
import {useAuth} from "../components/auth/AuthProvider";

import axios from "axios";
import {useEffect, useState} from "react";


const AdminPrivateRoute = function ({children}) {
    //    Check admin auth

    const {isAdmin} = useAuth();
    const location = useLocation();

    console.log('isAdmin: ' + isAdmin);

    // const [authenticated, setAuthenticated] = useState(false);
    // const [loading, setLoading] = useState(true);
    //
    //
    // // axios.get('')
    // useEffect(() => {
    //     axios.get('api/checkAuth').then((res) => {
    //         if (res.status == 200) {
    //             setAuthenticated(true);
    //         }
    //         setLoading(false);
    //     });
    //
    //     return () => {
    //         setAuthenticated(false);
    //     };
    // }, []);
    //
    // console.log("here");
    // console.log(authenticated + ", props: " + props);

    return (
        children
        // isAdmin ? children : <Navigate to='login' replace state={{from: location}}/>
    );
}


export default AdminPrivateRoute;