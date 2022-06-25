import {Button, Col, Container, Fade, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";

const UpdateCategory = function () {

    const navigate = useNavigate();

    // Category name to be updated, taken from URL parameters
    let {catName} = useParams();

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
                let idx = tempCategories.findIndex((item) => item.name == catName); // Find category being updated
                setCategory(tempCategories[idx]);   // Category being updated

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
            axios.post('/api/category/' + catName, inputs).then((res) => {
                    // Category added successfully
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
                        {/* Category name input */}
                        <Form.Group as={Col} md='4' className='mb-3' controlId="formCategory">
                            <Form.Control type='text' name='name' placeholder={catName} onChange={handleChange}
                                          isInvalid={validationErrors.name}/>
                            <Form.Control.Feedback type='invalid'>{validationErrors.name}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Category parent select options*/}
                        <Col className='col-md-4'>
                            <Form.Select aria-label="Default select example" name='parent' onChange={handleChange}>
                                <option value="">None</option>
                                {/* List all categories as possible parent categories*/}
                                {categories?.map(
                                    (category, idx) =>
                                        <option value={category.name} key={idx}>{category.name}</option>)}
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