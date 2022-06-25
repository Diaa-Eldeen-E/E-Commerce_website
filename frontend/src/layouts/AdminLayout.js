import {Outlet} from "react-router-dom";
import React from "react";
import AdminNavigationbar from "../components/admin/AdminNavigationbar";
import {Container, Row} from "react-bootstrap";
import Navigationbar from "../components/Navigationbar";


const AdminLayout = function () {

    return (
        <Container fluid>

            <Row>
                <AdminNavigationbar/>
            </Row>

            <Row>
                <Outlet/>
            </Row>

        </Container>
    );


}


export default AdminLayout;