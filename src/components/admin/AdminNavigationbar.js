import {Container, Navbar, NavDropdown, Nav, Form, FormControl, Button, Image} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useAuth} from "../auth/AuthProvider";

const getUsername = () => {
    return localStorage.getItem('auth_name');
}

const AdminNavigationbar = function () {

    const {onLogout} = useAuth();

    return (

        <Navbar bg="secondary" style={{"height": "50px"}}>
            <Container fluid className={"h-100"}>
                <Navbar.Brand href="#" className={"text-warning"}>Store</Navbar.Brand>

                <Nav
                    className="me-5 my-2 my-lg-0"
                    style={{maxHeight: '100px'}}
                >

                    <Nav.Link href="#action1">Home</Nav.Link>
                    <Nav.Link href="#action2">Link</Nav.Link>

                    {/*TODO: Categories where admin can edit*/}
                    <NavDropdown title="Categories" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item href="#action5">
                            Something else here
                        </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="#" disabled>
                        Link
                    </Nav.Link>
                </Nav>
                <Form className="d-flex h-100 w-50">
                    <FormControl
                        type="search"
                        placeholder="Search"
                        className="me-0 border-end-0 rounded-0 rounded-start"
                        aria-label="Search"
                    />
                    <Button className="h-100 p-0 rounded-0 bg-white border-start-0 rounded-end"
                            style={{"borderColor": "#ced4da"}}><Image
                        src={'../assets/search-logo.png'} className="h-100"/></Button>
                </Form>

                <Nav
                    className="justify-content-end"
                    style={{maxHeight: '100px', marginRight: '0px'}}
                    // navbarScroll
                >
                    <NavDropdown title={getUsername()} id="navbarScrollingDropdown">

                        <NavDropdown.Item href="/list">Your list</NavDropdown.Item>
                        <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                        {/*<NavDropdown.Divider/>*/}
                        <Form onSubmit={onLogout}>
                            <Button type='submit' className='bg-white text-danger border-0'>Sign out</Button>
                        </Form>
                        {/*<NavDropdown.Item href="#action5">*/}
                        {/*    Something else here*/}
                        {/*</NavDropdown.Item>*/}
                    </NavDropdown>

                </Nav>
            </Container>
        </Navbar>
    );


}


export default AdminNavigationbar;