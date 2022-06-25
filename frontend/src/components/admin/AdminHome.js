import React, {useEffect} from "react";
import axios from "axios";
import AdminNavigationbar from "./AdminNavigationbar.js";
import {Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router";


const AdminHome = function () {

    const navigate = useNavigate();
    // href={'/admin/category/' + catName + '?pn=' + (i) + '&ps=' + pageSize}

    useEffect(() => {
        // navigate('/admin/category/Electronics');
        navigate('/admin/categories');
    }, [])

    return (

        <Container>
            <Row>

                {/*TODO: Show last sold items, current balance, Average monthly sales, Average daily, today sales
                    The most sold items (last day, last month, absolute)*/}

                Admin Home page

            </Row>
        </Container>

    );


}


export default AdminHome;