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

const getUsername = () => {
    return localStorage.getItem('auth_name');
}

const AdminNavigationbar = function () {

    const {onLogout} = useAuth();
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
                <Link to={'/admin/category/' + category.name}> {category.name} </Link>
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

        <Container fluid className='bg-secondary'>

            <Navbar>
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

                                    <Nested parent_id={0} categs={categories} categsChildren={categsChildrenState}/>

                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item href="/admin/categories">
                                        All categories
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Col>

                        {/* Search form */}
                        <Col className='col-6' style={{maxHeight: "50px"}}>
                            <Form className="">

                                <InputGroup className='h-100'>
                                    <FormControl
                                        type="search"
                                        placeholder="Search"
                                        className="me-0 border-end-0 rounded-0 rounded-start"
                                        aria-label="Search"
                                    />
                                    <Image
                                        src={'/assets/search-logo.png'} className="w-auto rounded-end"
                                        style={{maxHeight: "40px"}}/>
                                </InputGroup>
                            </Form>
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

        </Container>
    );


}


export default AdminNavigationbar;