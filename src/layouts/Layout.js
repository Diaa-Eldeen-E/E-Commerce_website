import {Outlet} from "react-router-dom";
import React from "react";
import Navigationbar from "../components/Navigationbar";
import {Col, Container, Row} from "react-bootstrap";


const Layout = function () {

    return (

        <Container fluid>

            <Row>
                <Navigationbar/>
            </Row>

            <Row>
                <Outlet/>
            </Row>

        </Container>

    );


}


export default Layout;