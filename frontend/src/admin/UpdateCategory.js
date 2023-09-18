import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useGetCategoriesQuery, useGetCategoryQuery, useUpdateCategoryMutation } from "../features/api/apiSlice";

const UpdateCategory = function ()
{
    const navigate = useNavigate();
    let { categoryID } = useParams();

    // Load categories from database
    const { data: categories } = useGetCategoriesQuery()
    const { data: category } = useGetCategoryQuery(categoryID)

    // Update category form
    const [updateCategory, { isLoading, error }] = useUpdateCategoryMutation()
    const [inputs, setInputs] = useState({});
    let validationErrors = error?.data?.validation_errors
    let errorMessage = error?.data?.message

    useEffect(() =>
    {
        setInputs(category)
    }, [category])

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
        console.log(inputs);

        updateCategory(inputs).unwrap()
            .then(() => navigate(-1))
            .catch(error =>
            {
                console.log("update error in update category: ", error);
            })
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
                            <Form.Control type='text' name='name' defaultValue={category?.name} onChange={handleChange}
                                isInvalid={validationErrors?.name} />
                            <Form.Control.Feedback type='invalid'>{validationErrors?.name}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Category parent select options*/}
                        <Col className='col-md-4'>
                            <Form.Group className='mb-3' controlId="formParent">
                                <Form.Label>Parent</Form.Label>
                                <Form.Select aria-label="Default select example" name='parent_id' onChange={handleChange}
                                    isInvalid={validationErrors?.parent_id}
                                    defaultValue={category?.ancestors[0]?.name}
                                >
                                    <option value=""></option>
                                    {/* List all categories as possible parent categories*/}
                                    {
                                        categories?.map(
                                            (category, idx) =>
                                                <option value={category.id} key={category.id}>{category.name}</option>)
                                    }
                                    <option value="">None</option>
                                </Form.Select>
                                <Form.Control.Feedback type='invalid'>{validationErrors?.parent_id}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        {/* Category image source input */}
                        <Form.Group className='mb-3' controlId="formImgSrc">
                            <Form.Label>Image source</Form.Label>
                            <Form.Control type='text' name='image_src' defaultValue={category?.image_src}
                                onChange={handleChange} />

                        </Form.Group>
                    </Row>

                    <Row className='mt-5'>
                        <Col>
                            <Button type='submit' className='bg-primary'>Update category</Button>
                            <Button className='bg-danger mx-5'
                                onClick={() => navigate(-1)}>Cancel</Button>
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