import {Outlet} from "react-router-dom";
import React from "react";
import AdminNavigationbar from "../components/admin/AdminNavigationbar";


const Layout = function () {

    return (

        <div>
            <div className="container-fluid">
                <div className="row">
                    <AdminNavigationbar/>
                </div>

                <div className="row">


                </div>

            </div>
        </div>

    );


}


export default Layout;