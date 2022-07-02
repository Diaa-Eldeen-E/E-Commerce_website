import {
    Container,
    Navbar,
    NavDropdown,
    Nav,
    Form,
    FormControl,
    Button,
    Image,
    Row,
    Col,
    InputGroup
} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useAuth} from "../auth/AuthProvider";
import {useEffect, useState} from "react";
import axios from "axios";
import ListNestedCategories from "../ListNestedCategories";
import SearchBar from "../SearchBar";

const getUsername = () => {
    return localStorage.getItem('auth_name');
}


const AdminNavigationbar = function () {

    const {onLogout} = useAuth();
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
                        <Nav>
                            <Nav.Link href="#action1">Home</Nav.Link>

                            <NavDropdown title="Categories" id="navbarScrollingDropdown">

                                <ListNestedCategories categories={categories} isAdmin={true}/>

                                <NavDropdown.Divider/>
                                <NavDropdown.Item href="/admin/categories">
                                    All categories
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Col>

                    {/* Search form */}
                    <Col className='col-6' style={{maxHeight: "50px"}}>
                        <SearchBar isAdmin={true}/>
                    </Col>

                    {/* Account */}
                    <Col className='col-1'>
                        <Nav navbarScroll>
                            <NavDropdown title={getUsername()} id="navbarScrollingDropdown">

                                <NavDropdown.Item href="/list">Your list</NavDropdown.Item>
                                <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                                {/*<NavDropdown.Divider/>*/}
                                <Form onSubmit={onLogout}>
                                    <Button type='submit' className='bg-white text-danger border-0'>Sign
                                        out</Button>
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