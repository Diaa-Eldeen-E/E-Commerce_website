import {Outlet} from "react-router-dom";
import React from "react";
import Navigationbar from "../components/Navigationbar";


const Layout = function () {

    return (

        <div>
            <div className="container-fluid">
                <div className="row">
                    <Navigationbar/>
                </div>

                <div className="row">

                    <Outlet/>

                </div>

            </div>
        </div>

    );


}


export default Layout;