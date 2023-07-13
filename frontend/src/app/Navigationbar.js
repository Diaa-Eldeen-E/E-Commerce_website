import { Container, Navbar, NavDropdown, Nav, Form, Row, Button, Col, Badge } from "react-bootstrap";
// import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import ListNestedCategories from "../features/categories/ListNestedCategories";
import SearchBar from "../search/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../features/auth/authActions";


const Navigationbar = function ()
{

    // const { getToken, onLogout } = useAuth();
    const { userToken, userInfo, loading } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [categories, setCategories] = useState();

    //    Fetch categories
    useEffect(() =>
    {
        axios.get('/sanctum/csrf-cookie').then((response) =>
        {
            axios.get('/api/nestedcategories').then((res) =>
            {
                setCategories(res.data);
            }
            )
        });
    }, []);

    const handleLogout = (e) =>
    {

        e.preventDefault();
        dispatch(userLogout());
        console.log('logged out');
    }


    // Nav.Link: The Nav.Link component is maintained by react-bootstrap and returns an anchor (<a />) tag by default.
    // Link: Is a specialized anchor (<a />) tag that link specifically to internal routes maintained by 
    // a react-router/react-router-dom router component. It does not handle external links.
    // NavLink: A <NavLink> is a special kind of <Link> that knows whether or not it is "active".

    // If you need to use Nav.Link and link to internal pages then pass Link or NavLink as 
    // the component of the Nav.Link component and pass the appropriate required props through.

    return (

        <Navbar className='bg-secondary'>
            <Container fluid style={{ height: "50px" }}>
                <Row className='w-100'>
                    {/* Brand */}
                    <Col className='col-1'>
                        <Navbar.Brand href="#" className={"text-warning"}>Store</Navbar.Brand>
                    </Col>

                    {/* Links to home and categories*/}
                    <Col className='col-4'>
                        <Nav
                            className="me-5 my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                        >
                            <Nav.Link as={NavLink} to="/">Home</Nav.Link>


                            <NavDropdown title="Categories" id="navbarScrollingDropdown">

                                <ListNestedCategories categories={categories} />

                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/categories">
                                    All categories
                                </NavDropdown.Item>
                            </NavDropdown>

                        </Nav>
                    </Col>

                    {/* Search form */}
                    <Col className='col-6' style={{ maxHeight: "50px" }}>
                        <SearchBar />
                    </Col>

                    {/* Account */}
                    <Col className='col-1'>
                        <Nav navbarScroll>
                            <NavDropdown title={userInfo ? userInfo.userName : "Account"} id="navbarScrollingDropdown">
                                <NavDropdown.Item as={Link} to="/login" hidden={userToken ? true : false}>
                                    Sign in
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/register" hidden={userToken ? true : false}
                                    className='text-warning'>
                                    Register
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/cart"
                                    hidden={userToken ? false : true} disabled={loading}>
                                    Your cart
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/orders"
                                    hidden={userToken ? false : true} disabled={loading}>
                                    Your orders
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/wishlist"
                                    hidden={userToken ? false : true} disabled={loading}
                                >
                                    Your list
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/settings"
                                    hidden={userToken ? false : true}
                                    disabled={loading}
                                >
                                    Settings
                                </NavDropdown.Item>
                                {/*<NavDropdown.Divider/>*/}
                                <Form onSubmit={handleLogout}>
                                    <Button type='submit'
                                        className='bg-white text-danger border-0'
                                        hidden={userToken ? false : true}
                                        disabled={loading}
                                    >
                                        Sign out
                                    </Button>
                                </Form>
                                {/*<NavDropdown.Item href="#action5">*/}
                                {/*    Something else here*/}
                                {/*</NavDropdown.Item>*/}
                            </NavDropdown>

                            {/*    [TODO: Cart icon ] */}

                            <Nav.Link href="/cart">

                                Cart

                            </Nav.Link>

                            <Badge>4</Badge>


                        </Nav>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );


}


export default Navigationbar;