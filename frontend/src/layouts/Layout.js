import { Outlet } from "react-router-dom";
import React from "react";
import Navigationbar from "../app/Navigationbar";
import { Container, Row } from "react-bootstrap";
import { useGetNestedCategoriesQuery } from "../features/api/apiSlice";


const Layout = function ({ isAdmin })
{
    const { data: categories, isLoading, isSuccess, isError, error } = useGetNestedCategoriesQuery()

    return (

        <Container fluid>

            <Row>
                <Navigationbar isAdmin={isAdmin} />
            </Row>

            <Row>
                <Outlet />
            </Row>

            {/*  TODO: Add footer (copy rights, about us, contact, policies)  */}

        </Container >

    );


}


export default Layout;