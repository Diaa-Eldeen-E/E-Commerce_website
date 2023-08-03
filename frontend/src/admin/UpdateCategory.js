import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useGetCategoriesQuery, useGetCategoryQuery, useUpdateCategoryMutation } from "../features/api/apiSlice";

const UpdateCategory = function ()
{
    const navigate = useNavigate();
    let { categoryID } = useParams();

    // Update category form
    const [inputs, setInputs] = useState({ id: categoryID });
    // const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState('');

    // Load categories from database
    const { data: categories, isLoading, isSuccess, isError, error } = useGetCategoriesQuery()
    const { data: categoryResponse } = useGetCategoryQuery(categoryID)
    const category = categoryResponse?.category

    const [updateCategory] = useUpdateCategoryMutation()

    const handleChange = (event) =>
    {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({ ...inputs, [Name]: Value });
        console.log("Name: " + Name, "Value: " + Value);
        console.log("inputs: ", inputs);
    }

    const handleSubmit = function (event)
    {
        event.preventDefault();

        if (inputs.parent_id == category.id)
            setValidationErrors({ ...validationErrors, parent: 'Invalid parent category' })
        else if (!inputs?.name)
            setValidationErrors({ ...validationErrors, name: 'Category name required' })

        else
        {
            console.log(inputs);
            updateCategory(inputs).unwrap()
                .then(() => navigate('/admin/categories'))
                .catch(error =>
                {
                    console.log("update err: ", error);
                    // setErrorMessage(error?.data?.message)
                    setValidationErrors(error?.data?.validation_errors)
                })

        }
    }

    return (
        <Container>
            <Row className='w-75 mx-auto mt-3'>
                <Form onSubmit={handleSubmit}>

                    {/*<p className='text-danger'>{errorMessage}</p>*/}

                    <Row>
                        {/* Category name input */}
                        <Form.Group as={Col} md='4' className='mb-3' controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='text' name='name' placeholder={category?.name} onChange={handleChange}
                                isInvalid={validationErrors?.name} />
                            <Form.Control.Feedback type='invalid'>{validationErrors?.name}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Category parent select options*/}
                        <Col className='col-md-4'>
                            <Form.Group className='mb-3' controlId="formParent">
                                <Form.Label>Parent</Form.Label>
                                <Form.Select aria-label="Default select example" name='parent_id' onChange={handleChange}
                                    isInvalid={validationErrors?.parent}>
                                    <option value=""></option>
                                    {/* List all categories as possible parent categories*/}
                                    {categories?.map(
                                        (category, idx) =>
                                            <option value={category.id} key={category.id}>{category.name}</option>)}
                                    <option value="">None</option>
                                </Form.Select>
                                <Form.Control.Feedback type='invalid'>{validationErrors?.parent}</Form.Control.Feedback>
                            </Form.Group>
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



// useEffect(() =>
    // {

    //     axios.get('/sanctum/csrf-cookie').then((response) =>
    //     {
    //         axios.get('/api/categories').then((res) =>
    //         {

    //             // Remove the category being updated from the list of categories and store it separately
    //             let tempCategories = res.data?.slice();  // Copy categories
    //             let idx = tempCategories.findIndex((item) => item.id == categoryID); // Find category being updated
    //             setCategory(tempCategories[idx]);   // Product being updated
    //             setInputs(tempCategories[idx]);    // Default

    //             tempCategories?.splice(idx, 1);  // Remove category being updated from the list
    //             setCategories(tempCategories);

    //         })
    //     });
    // }, []);