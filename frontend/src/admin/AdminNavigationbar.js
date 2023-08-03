import { Container, Navbar, NavDropdown, Nav, Form, Button, Row, Col } from "react-bootstrap";
import ListNestedCategories from "../features/categories/ListNestedCategories";
import SearchBar from "../features/search/SearchBar";
import { userLogout } from "../features/auth/authActions";
import { useDispatch, useSelector } from "react-redux";
import { useGetNestedCategoriesQuery } from "../features/api/apiSlice";
import { Link, useNavigate, NavLink } from "react-router-dom";

const AdminNavigationbar = function ()
{
    const navigate = useNavigate();
    const { userToken, userInfo, loading } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    //    Fetch categories
    const { data: categories, isLoading, isSuccess, isError, error } = useGetNestedCategoriesQuery()

    const handleLogout = (e) =>
    {
        e.preventDefault();
        dispatch(userLogout()).unwrap()
            .then((response) => navigate('/'))
            .catch((error) => console.log("unwrapped error during logout: ", error))
    }

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
                        <Nav>
                            <Nav.Link as={NavLink} to="/admin">Home</Nav.Link>

                            <NavDropdown title="Categories" id="navbarScrollingDropdown">

                                <ListNestedCategories categories={categories} isAdmin={true} />

                                <NavDropdown.Divider />
                                <NavDropdown.Item as={NavLink} to="/admin/categories">
                                    All categories
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Col>

                    {/* Search form */}
                    <Col className='col-6' style={{ maxHeight: "50px" }}>
                        <SearchBar isAdmin={true} />
                    </Col>

                    {/* Account */}
                    <Col className='col-1'>
                        <Nav navbarScroll>
                            <NavDropdown title={userInfo?.userName} id="navbarScrollingDropdown">

                                <NavDropdown.Item as={Link} to="/admin/list" disabled={loading}>Your list</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/settings" disabled={loading}>Settings</NavDropdown.Item>
                                {/*<NavDropdown.Divider/>*/}
                                <Form onSubmit={handleLogout}>
                                    <Button type='submit' className='bg-white text-danger border-0'
                                        disabled={loading}>
                                        Signout
                                    </Button>
                                </Form>
                                {/*<NavDropdown.Item href="#action5">*/}
                                {/*    Something else here*/}
                                {/*</NavDropdown.Item>*/}
                            </NavDropdown>

                        </Nav>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );


}


export default AdminNavigationbar;