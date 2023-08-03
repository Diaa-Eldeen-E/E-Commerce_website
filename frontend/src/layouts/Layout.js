import { Outlet } from "react-router-dom";
import React from "react";
import Navigationbar from "../app/Navigationbar";
import { Container, Row } from "react-bootstrap";


const Layout = function ({ isAdmin })
{

    return (

        <Container fluid>

            <Row>
                <Navigationbar isAdmin={isAdmin} />
            </Row>

            <Row>
                <Outlet />
            </Row>

            {/*  TODO: Add footer (copy rights, about us, contact, policies)  */}

        </Container>

    );


}


export default Layout;