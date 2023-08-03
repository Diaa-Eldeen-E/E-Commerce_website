import { Col, Row, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteCategoryMutation } from "../api/apiSlice";


const CategoryItem = function ({ category, isAdmin, displayButtons })
{

    const [deleteCategory, { isLoading }] = useDeleteCategoryMutation()
    const navigate = useNavigate()

    return (
        <li key={category.id} className='list-group-item-action'>
            <Row className='align-items-center'>

                {/* Category name*/}
                <Col className='col-8'>
                    <Link to={(isAdmin ? '/admin/' : '/') + 'category/' + category.id}><p
                        className='my-auto'> {category.name}</p></Link>
                </Col>

                {
                    isAdmin && displayButtons &&
                    // Buttons
                    <Col>
                        <Link to={'/admin/updatecategory/' + category.id}>
                            <Button variant='outline-primary' className='mx-1 my-1'
                                disabled={isLoading}
                                onClick={() => navigate('/admin/updatecategory/' + category.id)}>
                                Update
                            </Button>
                        </Link>
                        <Button variant='outline-danger' className='mx-1 my-1'
                            onClick={() => deleteCategory(category.id)}
                            disabled={isLoading}>
                            Delete
                        </Button>
                    </Col>
                }

            </Row>
        </li>
    )
}

export default CategoryItem;


// axios.get('/sanctum/csrf-cookie').then((response) =>
    // {
    //     axios.delete('/api/category/' + categoryID).then((res) =>
    //     {
    //         if (res.data.status === 200)
    //             window.location.reload(false);
    //         else
    //             console.log('Failed to delete item');
    //     })
    // })