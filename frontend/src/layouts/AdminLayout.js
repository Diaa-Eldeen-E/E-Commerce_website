import { Outlet } from "react-router-dom";
import React from "react";
import AdminNavigationbar from "../admin/AdminNavigationbar";
import { Container, Row } from "react-bootstrap";
import Navigationbar from "../app/Navigationbar";


const AdminLayout = function ()
{

    return (
        <Container fluid>

            <Row>
                <AdminNavigationbar />
            </Row>

            <Row>
                <Outlet />
            </Row>

        </Container>
    );


}


export default AdminLayout;