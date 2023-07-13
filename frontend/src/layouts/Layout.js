import { Outlet } from "react-router-dom";
import React from "react";
import Navigationbar from "../app/Navigationbar";
import { Col, Container, Row } from "react-bootstrap";


const Layout = function ()
{

    return (

        <Container fluid>

            <Row>
                <Navigationbar />
            </Row>

            <Row>
                <Outlet />
            </Row>

            {/*  TODO: Add footer (copy rights, about us, contact, policies)  */}

        </Container>

    );


}


export default Layout;