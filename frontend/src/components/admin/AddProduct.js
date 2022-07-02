import {Button, Col, Container, FloatingLabel, Form, InputGroup, Row} from "react-bootstrap";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";


const AddProduct = function () {
    const navigate = useNavigate();

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
                setCategories(res.data);
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
            axios.post('/api/addproduct', inputs).then((res) => {
                    // ProductPage added successfully
                    if (res.data.status === 200) {
                        setErrorMessage('');
                        setValidationErrors('');
                        navigate('/admin/category/' + inputs.category_name);
                        // navigate(-1);
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

                <h3 className='text-danger my-3'>Add product</h3>

                <Form onSubmit={handleSubmit}>

                    {/*<p className='text-danger'>{errorMessage}</p>*/}
                    <Row>
                        {/* Product name input */}
                        <Form.Group className='mb-3' controlId="formCategory">
                            <FloatingLabel label='Name'>
                                <Form.Control type='text' name='name' placeholder='Product name'
                                              onChange={handleChange}
                                              isInvalid={validationErrors.name}/>
                                <Form.Control.Feedback type='invalid'>{validationErrors.name}</Form.Control.Feedback>
                            </FloatingLabel>

                        </Form.Group>

                        {/* ProductsPage parent select options*/}
                        <Form.Group className='mb-3'>
                            <FloatingLabel label='ProductsPage'>
                                <Form.Select aria-label="Default select example" name='category_name'
                                             onChange={handleChange}
                                             isInvalid={validationErrors.category_name}>
                                    <option value="">None</option>
                                    {/* List all categories as possible categories*/}
                                    {categories?.map(
                                        (category, idx) =>
                                            <option value={category.name} key={idx}>{category.name}</option>)}
                                </Form.Select>
                                <Form.Control.Feedback
                                    type='invalid'>{validationErrors.category_name}</Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>

                        {/* ProductPage image source input */}
                        <Form.Group className='mb-3' controlId="formImgSrc">
                            <FloatingLabel label='Image source'>
                                <Form.Control type='text' name='image_src' placeholder='Image source'
                                              onChange={handleChange}/>
                            </FloatingLabel>
                        </Form.Group>

                        {/* ProductPage description input */}
                        <Form.Group className='mb-3' controlId="formDescription">
                            <FloatingLabel label='Description'>
                                <Form.Control as='textarea' name='description' placeholder='ProductPage description'
                                              onChange={handleChange}
                                              style={{height: "100px"}}/>
                            </FloatingLabel>
                        </Form.Group>

                        {/* ProductPage price input */}
                        <Col>
                            <FloatingLabel label='Price' className='mb-3'>
                                <Form.Control
                                    placeholder="Price"
                                    aria-label="Price"
                                    name='price'
                                    onChange={handleChange}
                                    isInvalid={validationErrors.price}
                                />
                                <Form.Control.Feedback
                                    type='invalid'>{validationErrors.price}</Form.Control.Feedback>
                            </FloatingLabel>


                        </Col>

                        {/* ProductPage stock input */}
                        <Col>
                            <Form.Group className='mb-3' controlId="formDescription">
                                <FloatingLabel label='Stock'>
                                    <Form.Control type='text' name='stock' placeholder='ProductPage stock'
                                                  onChange={handleChange}
                                                  isInvalid={validationErrors.stock}/>
                                    <Form.Control.Feedback
                                        type='invalid'>{validationErrors.stock}</Form.Control.Feedback>
                                </FloatingLabel>

                            </Form.Group>

                        </Col>
                    </Row>
                    <Row className='mt-3'>
                        <Col>
                            <Button type='submit' className='bg-primary'>Add product</Button>
                            <Button className='bg-danger mx-5'
                                    onClick={() => navigate(-1)}>Cancel</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>

        </Container>

    )

}

export default AddProduct;