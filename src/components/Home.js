import React, {useEffect} from "react";
import Navigationbar from "../components/Navigationbar";
import {useNavigate} from "react-router";


const Home = function () {

    const navigate = useNavigate();
    // href={'/admin/category/' + catName + '?pn=' + (i) + '&ps=' + pageSize}

    useEffect(() => {
        navigate('/categories');
    }, [])
    return (

        <div>
            <div className="container-fluid">
                {/*<div className="row">*/}
                {/*    <Navigationbar/>*/}
                {/*</div>*/}

                <div className="row">

                    Home page

                </div>

            </div>
        </div>

    );


}


export default Home;