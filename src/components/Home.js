import {Outlet} from "react-router-dom";
import React from "react";
import Navigationbar from "../components/Navigationbar";


const Home = function () {

    return (

        <div>
            <div className="container-fluid">
                <div className="row">
                    <Navigationbar/>
                </div>

                <div className="row">

                    Home page

                </div>

            </div>
        </div>

    );


}


export default Home;