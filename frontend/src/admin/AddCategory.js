import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetCategoriesQuery, useAddCategoryMutation } from "../features/api/apiSlice";

const AddCategory = function ()
{

    const navigate = useNavigate();

    // Add category form
    const [inputs, setInputs] = useState({});
    const [addCategory, { isLoading, error, isSuccess }] = useAddCategoryMutation()
    let validationErrors = error?.data?.validation_errors
    let errorMessage = error?.data?.message

    // Load categories from database
    const { data: categories } = useGetCategoriesQuery()

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

        addCategory(inputs).unwrap()
            .then(() => navigate('/admin/categories'))
            .catch()
    }

    return (
        <Container>
            <Row className='w-75 mx-auto mt-3'>
                <Form onSubmit={handleSubmit}>

                    <p className='text-danger'>{errorMessage}</p>
                    <Row>
                        {/* Category name input */}
                        <Form.Group as={Col} md='4' className='mb-3' controlId="formName">
                            <Form.Control type='text' name='name' placeholder='Category name'
                                onChange={handleChange}
                                isInvalid={validationErrors?.name}
                            />
                            <Form.Control.Feedback type='invalid'>{validationErrors?.name}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Category parent select options*/}
                        <Col className='col-md-4'>
                            <Form.Select aria-label="Default select example" name='parent_id' onChange={handleChange}>
                                <option value="">None</option>
                                {/* List all categories as possible parent categories*/}
                                {categories?.map(
                                    (category, idx) =>
                                        <option value={category.id} key={category.id}>{category.name}</option>)}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='mt-5'>
                        <Col>
                            <Button type='submit' className='bg-primary' disabled={isLoading}>
                                Add category
                            </Button>

                            <Button className='bg-danger mx-5' disabled={isLoading}
                                onClick={() => navigate('/admin/categories')}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Row>

        </Container>
    )

}

export default AddCategory;