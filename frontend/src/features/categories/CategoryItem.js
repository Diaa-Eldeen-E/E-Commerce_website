import { Col, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteCategoryMutation } from "../api/apiSlice";


const CategoryItem = function ({ category, isAdmin = 0, displayButtons = 0 })
{

    const [deleteCategory, { isLoading }] = useDeleteCategoryMutation()
    const navigate = useNavigate()

    return (
        <Card className="text-center">
            <Link to={(isAdmin ? '/admin' : '') + '/product-category/' + category.id + '/' + category.name}>
                <Card.Img src={category.image_src}
                    // style={{ maxWidth: "160px" }} 
                    style={{ height: "100px", width: 'auto', maxWidth: "160px" }} />
            </Link>
            <Card.Body>
                <Card.Title>{category.name}</Card.Title>
            </Card.Body>


            {/*  Admin edit and delete buttons */}
            {
                isAdmin && displayButtons ?

                    <Col>

                        <Button variant='outline-primary' className='mx-1 my-1'
                            disabled={isLoading}
                            onClick={() => navigate('/updatecategory/' + category.id)}
                        >
                            Update
                        </Button>

                        <Button variant='outline-danger' className='mx-1 my-1'
                            onClick={() => deleteCategory(category.id)}
                            disabled={isLoading}>
                            Delete
                        </Button>
                    </Col>

                    :

                    <></>
            }
        </Card>

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