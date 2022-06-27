import {Col, Row, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from "axios";
import {useNavigate} from "react-router";


const CategoryItem = function ({category, isAdmin, displayButtons}) {

    const navigate = useNavigate();

    const deleteCategory = function (catName) {

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.delete('/api/category?' + catName).then((res) => {
                if (res.data.status === 200)
                    window.location.reload(false);
                else
                    console.log('Failed to delete item');
            })
        })
    }


    return (
        <li key={category.id} className='list-group-item-action'>
            <Row className='align-items-center'>

                {/* Category name*/}
                <Col className='col-8'>
                    <Link to={(isAdmin ? '/admin/' : '/') + 'category/' + category.name}><p
                        className='my-auto'> {category.name}</p></Link>
                </Col>

                {
                    isAdmin && displayButtons &&
                    // Buttons
                    <Col>
                        <Link to={'/admin/updatecategory/' + category.name}>
                            <Button variant='outline-primary' className='mx-1 my-1'>Update</Button>
                        </Link>
                        <Button variant='outline-danger' className='mx-1 my-1'
                                onClick={() => deleteCategory(category.name)}>Delete</Button>
                    </Col>
                }

            </Row>
        </li>
    )
}

export default CategoryItem;