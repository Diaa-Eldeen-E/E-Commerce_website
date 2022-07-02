import {Button, Col, Container, FloatingLabel, Form, InputGroup, Row} from "react-bootstrap";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";


const UpdateProduct = function () {
    const navigate = useNavigate();

    // Update category form
    let {productID} = useParams();
    const [product, setProduct] = useState({});
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

    // Load product from database
    useEffect(() => {

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/product?product_id=' + productID).then((res) => {
                setProduct(res.data.product);
            })
        });
    }, [productID]);

    const handleChange = (event) => {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({...inputs, [Name]: Value});
        console.log("Name: " + Name, "Value: " + Value);
    }

    const handleSubmit = function (event) {
        event.preventDefault();

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.put('/api/product/' + productID, inputs).then((res) => {
                    // ProductPage added successfully
                    if (res.data.status === 200) {
                        setErrorMessage('');
                        setValidationErrors('');
                        navigate(-1);
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

                <h3 className='text-danger my-3'>Update product</h3>

                <Form onSubmit={handleSubmit}>

                    <Row>
                        {/* ProductPage name input */}
                        <Form.Group className='mb-3' controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='text' name='name' placeholder={product.name}
                                          onChange={handleChange}
                                          isInvalid={validationErrors.name}/>
                            <Form.Control.Feedback type='invalid'>{validationErrors.name}</Form.Control.Feedback>


                        </Form.Group>

                        {/* Product category select options*/}
                        <Form.Group className='mb-3'>
                            <Form.Label>Category</Form.Label>
                            <Form.Select aria-label="Default select example" name='category_name'
                                         onChange={handleChange}
                                         isInvalid={validationErrors.category_name}>
                                <option value=""></option>
                                {/* List all categories as possible categories*/}
                                {categories?.map(
                                    (category, idx) =>
                                        <option value={category.name} key={idx}>{category.name}</option>)}
                            </Form.Select>
                            <Form.Control.Feedback
                                type='invalid'>{validationErrors.category_name}</Form.Control.Feedback>

                        </Form.Group>

                        {/* Product image source input */}
                        <Form.Group className='mb-3' controlId="formImgSrc">
                            <Form.Label>Image source</Form.Label>
                            <Form.Control type='text' name='image_src' placeholder={product.image_src}
                                          onChange={handleChange}/>

                        </Form.Group>

                        {/* Product description input */}
                        <Form.Group className='mb-3' controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as='textarea' name='description' placeholder={product.description}
                                          onChange={handleChange}
                                          style={{height: "100px"}}/>
                        </Form.Group>
                    </Row>
                    <Row>
                        {/* Product price input */}
                        <Col>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                placeholder={product.price}
                                aria-label="Price"
                                name='price'
                                onChange={handleChange}
                                isInvalid={validationErrors.price}
                            />
                            <Form.Control.Feedback
                                type='invalid'>{validationErrors.price}</Form.Control.Feedback>


                        </Col>

                        {/* Product stock input */}
                        <Col>
                            <Form.Group controlId="formStock">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type='text' name='stock' placeholder={product.stock}
                                              onChange={handleChange}
                                              isInvalid={validationErrors.stock}/>
                                <Form.Control.Feedback
                                    type='invalid'>{validationErrors.stock}</Form.Control.Feedback>


                            </Form.Group>

                        </Col>
                    </Row>

                    <Row className='mt-4'>
                        <Col>
                            <Button type='submit' className='bg-primary'>Update product</Button>
                            <Button className='bg-danger mx-5'
                                    onClick={() => navigate(-1)}>Cancel</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>

        </Container>

    )

}

export default UpdateProduct;