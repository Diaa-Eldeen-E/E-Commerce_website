import { Col, Row, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteCategoryMutation } from "../api/apiSlice";


const CategoryLink = function ({ category, isAdmin = 0, displayButtons = 0 })
{

    const [deleteCategory, { isLoading }] = useDeleteCategoryMutation()
    const navigate = useNavigate()

    return (
        <Row className={'category-link'}>

            {/* // Category name*/}
            <Col>
                <Link to={(isAdmin ? '/admin/' : '/') + 'product-category/' + category.id + '/' + category.name}><p
                    className='my-auto'> {category.name}</p></Link>
            </Col>


            {/*  Admin edit and delete buttons */}
            {
                isAdmin && displayButtons ?

                    <Col xs={"auto"} >

                        <Button variant='outline-warning' className='mx-1 my-1' size="sm"
                            disabled={isLoading}
                            onClick={() => navigate('/updatecategory/' + category.id)}
                        >
                            Edit
                        </Button>

                        <Button variant='outline-danger' className='mx-1 my-1' size="sm"
                            onClick={() => deleteCategory(category.id)}
                            disabled={isLoading}>
                            Delete
                        </Button>
                    </Col>

                    :

                    <></>
            }
        </Row>
    )
}

export default CategoryLink;