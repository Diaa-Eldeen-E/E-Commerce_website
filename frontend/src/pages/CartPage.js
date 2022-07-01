import {useEffect, useState} from "react";
import axios from "axios";
import Loading from "../components/Loading";
import {Table, Container, Button} from "react-bootstrap";
import {Link} from "react-router-dom";

const removeFromCart = (product) => {
    axios.get('/sanctum/csrf-cookie').then((response) => {
        axios.delete('/api/removefromcart?product_id=' + product.id).then((res) => {
            if (res.data?.status === 200) {
                window.location.reload(false);
            }
        })
    })
}

const CartPage = function () {

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/cart').then((res) => {
                if (res.data?.status === 200)
                    setProducts(res.data.products);

                setIsLoading(false);
            })
        })
    }, []);

    return (
        isLoading ?
            <Loading/>
            :
            products?.length > 0 ?
                <Container className='w-75 mt-5'>
                    <Table striped hover className='align-items-center justify-content-start'>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                        </thead>

                        <tbody>
                        {
                            products.map((product, idx) =>
                                <tr className='table-row' key={product.id}>
                                    <td>{idx + 1}</td>
                                    <td><Link to={'/product/' + product.id}>{product.name}</Link></td>
                                    <td>{product.price}</td>
                                    <td>{product.pivot.quantity}</td>
                                    <td>{product.pivot.quantity * product.price}</td>
                                    <td>
                                        <Button variant='outline-danger'
                                                onClick={() => removeFromCart(product)}>
                                            x
                                        </Button>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </Table>

                    {/*  TODO: Proceed to checkout  */}

                </Container>

                :

                <h4>The cart is empty</h4>
    )

}

export default CartPage;