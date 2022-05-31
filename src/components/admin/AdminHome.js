import React, {useEffect} from "react";
import axios from "axios";
import AdminNavigationbar from "./AdminNavigationbar.js";


const AdminHome = function () {


    return (

        <div>
            <div className="container-fluid">
                <div className="row">
                    <AdminNavigationbar/>
                </div>

                <div className="row">

                    Admin Home page

                </div>

            </div>
        </div>

    );


}


export default AdminHome;