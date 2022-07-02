import {Container, Navbar, NavDropdown, Nav, Form, Row, Button, Image, Col} from "react-bootstrap";
import {useAuth} from "../auth/AuthProvider";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import ListNestedCategories from "./ListNestedCategories";
import SearchBar from "./SearchBar";


const getUsername = () => {
    return localStorage.getItem('auth_name');
}

const Navigationbar = function () {

    const {getToken, onLogout} = useAuth();

    const [categories, setCategories] = useState();

    //    Fetch categories
    useEffect(() => {
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/nestedcategories').then((res) => {
                    setCategories(res.data);
                }
            )
        });
    }, []);


    return (

        <Navbar className='bg-secondary'>
            <Container fluid style={{height: "50px"}}>
                <Row className='w-100'>
                    {/* Brand */}
                    <Col className='col-1'>
                        <Navbar.Brand href="#" className={"text-warning"}>Store</Navbar.Brand>
                    </Col>

                    {/* Links to home and categories*/}
                    <Col className='col-4'>
                        <Nav
                            className="me-5 my-2 my-lg-0"
                            style={{maxHeight: '100px'}}
                        >
                            <Nav.Link href="/">Home</Nav.Link>


                            <NavDropdown title="Categories" id="navbarScrollingDropdown">

                                <ListNestedCategories categories={categories}/>

                                <NavDropdown.Divider/>
                                <NavDropdown.Item href="/categories">
                                    All categories
                                </NavDropdown.Item>
                            </NavDropdown>

                        </Nav>
                    </Col>

                    {/* Search form */}
                    <Col className='col-6' style={{maxHeight: "50px"}}>
                        <SearchBar/>
                    </Col>

                    {/* Account */}
                    <Col className='col-1'>
                        <Nav navbarScroll>
                            <NavDropdown title={getToken() ? getUsername() : "Account"} id="navbarScrollingDropdown">
                                <NavDropdown.Item href="/login" hidden={getToken() ? true : false}>
                                    Sign in
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/register" hidden={getToken() ? true : false}
                                                  className='text-warning'>
                                    Register
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/cart" hidden={getToken() ? false : true}>
                                    Your cart
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/orders" hidden={getToken() ? false : true}>
                                    Your orders
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/wishlist" hidden={getToken() ? false : true}>
                                    Your list
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/settings"
                                                  hidden={getToken() ? false : true}>
                                    Settings
                                </NavDropdown.Item>
                                {/*<NavDropdown.Divider/>*/}
                                <Form onSubmit={onLogout}>
                                    <Button type='submit' className='bg-white text-danger border-0'
                                            hidden={getToken() ? false : true}>
                                        Sign out
                                    </Button>
                                </Form>
                                {/*<NavDropdown.Item href="#action5">*/}
                                {/*    Something else here*/}
                                {/*</NavDropdown.Item>*/}
                            </NavDropdown>

                            {/*    [TODO: Cart icon ] */}
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );


}


export default Navigationbar;