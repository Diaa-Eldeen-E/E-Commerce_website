import {Button, Col, Container, Fade, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";

const UpdateCategory = function () {

    const navigate = useNavigate();

    // ProductsPage name to be updated, taken from URL parameters
    let {categoryID} = useParams();

    // Update category form
    const [category, setCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const [inputs, setInputs] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState('');

    // Load categories from database
    useEffect(() => {

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/categories').then((res) => {

                // Remove the category being updated from the list of categories and store it separately
                let tempCategories = res.data?.slice();  // Copy categories
                let idx = tempCategories.findIndex((item) => item.id == categoryID); // Find category being updated
                setCategory(tempCategories[idx]);   // Product being updated
                setInputs(tempCategories[idx]);    // Default

                tempCategories?.splice(idx, 1);  // Remove category being updated from the list
                setCategories(tempCategories);

            })
        });
    }, []);

    const handleChange = (event) => {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({...inputs, [Name]: Value});
        console.log("Name: " + Name, "Value: " + Value);
    }

    const handleSubmit = function (event) {
        event.preventDefault();

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.put('/api/category/' + categoryID, inputs).then((res) => {
                    // ProductsPage added successfully
                    if (res.data.status === 200) {
                        setErrorMessage('');
                        setValidationErrors('');
                        navigate('/admin/categories');
                    }
                    // Failed
                    else {
                        // Show error message
                        setErrorMessage(res.data.message);
                        setValidationErrors(res.data.validation_errors);
                    }
                }
            )
        })
    }

    return (
        <Container>
            <Row className='w-75 mx-auto mt-3'>
                <Form onSubmit={handleSubmit}>

                    {/*<p className='text-danger'>{errorMessage}</p>*/}
                    <Row>
                        {/* Products name input */}
                        <Form.Group as={Col} md='4' className='mb-3' controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='text' name='name' placeholder={category.name} onChange={handleChange}
                                          isInvalid={validationErrors.name}/>
                            <Form.Control.Feedback type='invalid'>{validationErrors.name}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Products parent select options*/}
                        <Col className='col-md-4'>
                            <Form.Label>Parent</Form.Label>
                            <Form.Select aria-label="Default select example" name='parent_id' onChange={handleChange}>
                                <option value=""></option>
                                {/* List all categories as possible parent categories*/}
                                {categories?.map(
                                    (category, idx) =>
                                        <option value={category.id} key={category.id}>{category.name}</option>)}
                                <option value="">None</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='mt-5'>
                        <Col>
                            <Button type='submit' className='bg-primary'>Update category</Button>
                            <Button className='bg-danger mx-5'
                                    onClick={() => navigate('/admin/categories')}>Cancel</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>

        </Container>
    )

}

export default UpdateCategory;