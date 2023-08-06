import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useGetCategoriesQuery, useUpdateProductMutation, useGetProductQuery } from "../features/api/apiSlice";


const UpdateProduct = function ()
{
    const navigate = useNavigate();
    let { productID } = useParams();

    // Update category form
    const [inputs, setInputs] = useState({});

    const [updateProduct, { isLoading, error }] = useUpdateProductMutation()
    let validationErrors = error?.data?.validation_errors
    let errorMessage = error?.data?.message

    // Load categories from database
    const { data: categories } = useGetCategoriesQuery()

    // Load product from database
    const { data: product } = useGetProductQuery(productID)

    const handleChange = (event) =>
    {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({ ...inputs, [Name]: Value });
        console.log("Name: " + Name, "Value: " + Value);
    }

    const handleSubmit = function (event)
    {
        event.preventDefault();

        updateProduct(inputs).then(() => navigate('..'))
            .catch(err => console.log('Caught error in update product: ', err))
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
                            <Form.Control type='text' name='name' defaultValue={product?.name}
                                onChange={handleChange}
                                isInvalid={validationErrors?.name} />
                            <Form.Control.Feedback type='invalid'>{validationErrors?.name}</Form.Control.Feedback>


                        </Form.Group>

                        {/* Product category select options*/}
                        <Form.Group className='mb-3'>
                            <Form.Label>Category</Form.Label>
                            <Form.Select aria-label="Default select example" name='category_name'
                                defaultValue={product?.category?.name}
                                onChange={handleChange}
                                isInvalid={validationErrors?.category_name}>
                                {/* List all categories as possible categories*/}
                                {categories?.map(
                                    (category, idx) =>
                                        <option value={category.name} key={idx}>{category.name}</option>)}
                            </Form.Select>
                            <Form.Control.Feedback
                                type='invalid'>{validationErrors?.category_name}</Form.Control.Feedback>

                        </Form.Group>

                        {/* Product image source input */}
                        <Form.Group className='mb-3' controlId="formImgSrc">
                            <Form.Label>Image source</Form.Label>
                            <Form.Control type='text' name='image_src' defaultValue={product?.image_src}
                                onChange={handleChange} />

                        </Form.Group>

                        {/* Product description input */}
                        <Form.Group className='mb-3' controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as='textarea' name='description' defaultValue={product?.description}
                                onChange={handleChange}
                                style={{ height: "100px" }} />
                        </Form.Group>
                    </Row>
                    <Row>
                        {/* Product price input */}
                        <Col>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                defaultValue={product?.price}
                                aria-label="Price"
                                name='price'
                                onChange={handleChange}
                                isInvalid={validationErrors?.price}
                            />
                            <Form.Control.Feedback
                                type='invalid'>{validationErrors?.price}</Form.Control.Feedback>


                        </Col>

                        {/* Product stock input */}
                        <Col>
                            <Form.Group controlId="formStock">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type='text' name='stock' defaultValue={product?.stock}
                                    onChange={handleChange}
                                    isInvalid={validationErrors?.stock} />
                                <Form.Control.Feedback
                                    type='invalid'>{validationErrors?.stock}</Form.Control.Feedback>


                            </Form.Group>

                        </Col>
                    </Row>

                    <Row className='mt-4'>
                        <Col>
                            <Button type='submit' className='bg-primary' disabled={isLoading}>Update product</Button>
                            <Button className='bg-danger mx-5' disabled={isLoading}
                                onClick={() => navigate(-1)}>Cancel</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>

        </Container>

    )

}

export default UpdateProduct;