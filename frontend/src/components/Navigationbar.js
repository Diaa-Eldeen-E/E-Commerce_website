import {Container, Navbar, NavDropdown, Nav, Form, FormControl, Button, Image} from "react-bootstrap";
import {useAuth} from "./auth/AuthProvider";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";


const getUsername = () => {
    return localStorage.getItem('auth_name');
}

const Navigationbar = function () {

    const {getToken, onLogout} = useAuth();

    const [categories, setCategories] = useState();
    const [categsChildrenState, setCategsChildrenState] = useState([]);

    //    Fetch categories
    useEffect(() => {
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/categories').then((res) => {

                    // Data preprocessing
                    let tempCategories = res.data;
                    let minIdx = 9999999;
                    tempCategories.forEach((cat) => {
                        if (cat.id < minIdx)
                            minIdx = cat.id;
                    });

                    let tempCategs = [];
                    let tempCategsChildren = [];
                    tempCategories.forEach((cat) => {
                        cat.id -= (minIdx - 1);
                        if (cat.parent_id > 0)
                            cat.parent_id -= (minIdx - 1);
                        else
                            cat.parent_id = 0;

                        // Add it in categories array
                        tempCategs[cat.id] = cat;

                        // Push this category in its parent array of children
                        if (tempCategsChildren[cat.parent_id]?.length >= 1)
                            tempCategsChildren[cat.parent_id].push(cat.id);
                        else
                            tempCategsChildren[cat.parent_id] = [cat.id];
                    });

                    setCategories(tempCategs);
                    setCategsChildrenState(tempCategsChildren);
                }
            )
        });
    }, []);


    const ListItem = function ({category}) {
        return (
            <li key={category.id} className='list-group-item-action'>
                <Link to={'/category/' + category.name}> {category.name} </Link>
            </li>
        )
    }

    // Listing nested categories
    const Nested = ({parent_id, categs, categsChildren}) => {

        const listChildren = (cat_id) => {
            return (
                <>
                    <ListItem category={categs[cat_id]}/>

                    {categsChildren[cat_id]?.length > 0 &&
                        <Nested parent_id={cat_id} categs={categories} categsChildren={categsChildrenState}/>}
                </>
            );
        }


        if (categsChildren[parent_id]?.length > 0) {
            return (
                <ul style={{listStyleType: "none"}} className='ps-3'>
                    {categsChildren[parent_id].map(listChildren)}
                </ul>
            )
        } else
            return (<div></div>);
    }

    return (

        <Navbar bg="secondary" style={{"height": "50px"}}>
            <Container fluid className={"h-100"}>
                <Navbar.Brand href="/" className={"text-warning"}>Store</Navbar.Brand>

                <Nav
                    className="me-5 my-2 my-lg-0"
                    style={{maxHeight: '100px'}}
                >
                    <Nav.Link href="/">Home</Nav.Link>


                    <NavDropdown title="Categories" id="navbarScrollingDropdown">

                        <Nested parent_id={0} categs={categories} categsChildren={categsChildrenState}/>

                        <NavDropdown.Divider/>
                        <NavDropdown.Item href="/categories">
                            All categories
                        </NavDropdown.Item>
                    </NavDropdown>

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
                        src={'/assets/search-logo.png'} className="h-100"/></Button>
                </Form>

                <Nav
                    className="justify-content-end"
                    style={{maxHeight: '100px', marginRight: '0px'}}
                    // navbarScroll
                >
                    <NavDropdown title={getToken() ? getUsername() : "Account"} id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/login" hidden={getToken() ? true : false}>
                            Sign in
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/register" hidden={getToken() ? true : false} className='text-warning'>
                            Register
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/orders" hidden={getToken() ? false : true}>Your
                            orders</NavDropdown.Item>
                        <NavDropdown.Item href="/list" hidden={getToken() ? false : true}>Your list</NavDropdown.Item>
                        <NavDropdown.Item href="/settings"
                                          hidden={getToken() ? false : true}>Settings</NavDropdown.Item>
                        {/*<NavDropdown.Divider/>*/}
                        <Form onSubmit={onLogout}>
                            <Button type='submit' className='bg-white text-danger border-0'
                                    hidden={getToken() ? false : true}>Sign
                                out</Button>
                        </Form>
                        {/*<NavDropdown.Item href="#action5">*/}
                        {/*    Something else here*/}
                        {/*</NavDropdown.Item>*/}
                    </NavDropdown>

                    {/*    [TODO: Cart]*/}
                </Nav>
            </Container>
        </Navbar>
    );


}


export default Navigationbar;